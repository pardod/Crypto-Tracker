import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { hCaptchaSiteKey } from "@/lib/supabase";

const LoginForm = ({ email, setEmail, password, setPassword, onSubmit, onGoogleSignIn, onToggleForm }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <Button type="submit" className="w-full">Sign In</Button>
    <Button type="button" variant="ghost" className="w-full" onClick={onToggleForm}>
      Sign Up with Email
    </Button>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
      </div>
    </div>
    <Button type="button" variant="outline" className="w-full" onClick={onGoogleSignIn}>
      Sign in with Google
    </Button>
  </>
);

const SignUpForm = ({ email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, username, setUsername, onSubmit, onToggleForm, onCaptchaVerify }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        type="text"
        placeholder="Choose your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="signup-email">Email</Label>
      <Input
        id="signup-email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="signup-password">Password</Label>
      <Input
        id="signup-password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="confirm-password">Confirm Password</Label>
      <Input
        id="confirm-password"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </div>
    <div className="flex justify-center my-4">
      <HCaptcha
        sitekey={hCaptchaSiteKey}
        onVerify={onCaptchaVerify}
      />
    </div>
    <Button type="submit" className="w-full">Sign Up</Button>
    <Button type="button" variant="ghost" className="w-full" onClick={onToggleForm}>
      Back to Login
    </Button>
  </>
);

export const AuthDialog = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setIsOpen(false);
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await signIn(email, password);
      handleAuthSuccess();
    } else {
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      if (!captchaToken) {
        alert("Please complete the captcha verification");
        return;
      }
      await signUp(email, password, username, captchaToken);
      handleAuthSuccess();
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  if (user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? "Login to your account" : "Create an account"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {isLogin ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onSubmit={handleSubmit}
              onGoogleSignIn={handleGoogleSignIn}
              onToggleForm={() => setIsLogin(false)}
            />
          ) : (
            <SignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              username={username}
              setUsername={setUsername}
              onSubmit={handleSubmit}
              onToggleForm={() => setIsLogin(true)}
              onCaptchaVerify={handleCaptchaVerify}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
