'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useState } from "react"


export default function TheatreLoginPage(){
    const [displayError, setDisplayError] = useState<string>('hidden');
    const [error, setError] = useState<string>("");
    const [displaySuccess, setDisplaySuccess] = useState<string>('hidden');
    const router = useRouter();
    const [isProcessing, setProcessing] = useState<boolean>(false);

    async function handleFormSubmission(e : React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setProcessing(true);
        const target = e.target as typeof e.target & {
            email: {value: string},
            password: {value: string}
        }

        const email = target.email.value;
        const password = target.password.value;
        const jsonPayload = {
            theatre_user_email: email,
            theatre_user_password: password
        }

        try{
            const response = await fetch('/api/theatre/login', {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(jsonPayload)
            })

            const data = await response.json();
            if(data.error){
                setDisplayError('block');
                setError(data.error);
                setDisplaySuccess('hidden');
                setProcessing(false);
            }
            else if(data.success){
                setDisplayError('hidden');
                setDisplaySuccess('block');
                setTimeout(()=>{
                    window.location.href='/theatre/home'
                }, 2000)
            }

        }
        catch(error){
            setDisplayError('block');
            setError("Unable to communicate with the server. Please try again later");
            setDisplaySuccess('hidden');
            console.error(error);
            setProcessing(false);
        }
        
    }

    return (
        <>
            <div className="w-full flex flex-col justify-center items-center relative" style={{minHeight:"calc(100vh - 5rem)"}}>
            <Alert variant="destructive" className={`absolute top-0 left-0 z-0 ${displayError}`}>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>

            <Alert className={`absolute top-0 left-0 z-0 ${displaySuccess}`}>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                    You have successfully logged in. Redirecting..
                </AlertDescription>
            </Alert>


            <form onSubmit={handleFormSubmission}>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="flex flex-col justify-center items-center gap-3 mb-2">
                        <div>Login</div>
                    </CardTitle>
                    <CardDescription className="text-center">Login using your Theatre account</CardDescription>
                </CardHeader>
                <CardContent>
                    
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" autoComplete="off" required placeholder="example@domain.com" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" autoComplete="off" required />
                        </div>
                    </div>
                    
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button type="submit" disabled={isProcessing}>Login</Button>
                </CardFooter>
                
            </Card>
            </form>

            </div>

            

        </>
    )
}

