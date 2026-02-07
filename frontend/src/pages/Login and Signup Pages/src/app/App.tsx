import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { LoginForm } from "@/app/components/LoginForm";
import { SignupForm } from "@/app/components/SignupForm";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl mb-2">Welcome</h1>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-6">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </TabsContent>
              <TabsContent value="signup" className="mt-6">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Fill in your details to get started
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-600">
          © 2026 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
