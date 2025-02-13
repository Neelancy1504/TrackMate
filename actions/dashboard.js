"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//as next.js doesnot accept float number we need to serialize transaction by converting it back to decimal value
const serializeTransaction = (obj)  => {
    const serialized = { ...obj};

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }

    if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
}

export async function createAccount(data) {
    try{
        const { userId } = await auth();
        if(!userId ) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where:{ clerkUserId : userId },
        })

        if(!user){
            throw new Error("User not Found!");
        }

    //convert balance to float
    const balanceFloat = parseFloat(data.balance)
    if(isNaN(balanceFloat)){
        throw new Error("invalid balance amount");
     }

    //check if this is the user;s first account
    const existingAccounts = await db.account.findMany({
        where:{ userId : user.id },
    });

    const shouldBeDefault = 
        existingAccounts.length === 0 ? true : data.isDefault;

        if(shouldBeDefault){
            await db.account.updateMany({
                where: {userId: user.id , isDefault: true},
                data: {isDefault: false},
            });
        }

        const account = await db.account.create({
            data:{
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        const serializeAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return {success:true , data: serializeAccount};
    }
    catch(error){
        throw new Error(error.message);
    }
}

export async function getUserAccounts() {
    const { userId } = await auth();
        if(!userId ) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where:{ clerkUserId : userId },
        })

        if(!user){
            throw new Error("User not Found!");
        }

        const accounts = await db.account.findMany({
            where: {userId: user.id},
            orderBy: {createdAt: "desc"},
            include: {
                _count: {
                    select:{
                        transactions: true,
                    },
                },
            },
        });

        const serializedAccount = accounts.map(serializeTransaction);

        return serializedAccount;
}