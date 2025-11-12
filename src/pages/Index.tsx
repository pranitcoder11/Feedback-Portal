import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <MessageSquare className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="mb-6 text-5xl font-bold">
            Student Feedback Portal
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground">
            Share your thoughts anonymously and help shape a better academic experience
          </p>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="shadow-elegant"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mt-16">
            <div className="rounded-lg bg-card p-6 shadow-elegant">
              <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">100% Anonymous</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback is completely anonymous. Share freely without concerns.
              </p>
            </div>

            <div className="rounded-lg bg-card p-6 shadow-elegant">
              <TrendingUp className="mx-auto mb-4 h-12 w-12 text-secondary" />
              <h3 className="mb-2 text-lg font-semibold">Track History</h3>
              <p className="text-sm text-muted-foreground">
                View all your past feedback submissions in one place.
              </p>
            </div>

            <div className="rounded-lg bg-card p-6 shadow-elegant">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-accent" />
              <h3 className="mb-2 text-lg font-semibold">Easy Submission</h3>
              <p className="text-sm text-muted-foreground">
                Quick and intuitive feedback forms with QR code support.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
