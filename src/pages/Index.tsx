import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, BarChart3Icon, UsersIcon, BrainIcon } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">🎓 Aula Autonoma</h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Transform student feedback into actionable insights. Help teachers understand classroom behavior and learning trends through AI-powered analysis.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/student">
              <Button variant="student" size="lg" className="w-full sm:w-auto">
                📝 Student Form
              </Button>
            </Link>
            <Link to="/teacher">
              <Button variant="teacher" size="lg" className="w-full sm:w-auto">
                📊 Teacher Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-primary/10 p-3 w-fit">
                <BookOpenIcon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Simple Forms</CardTitle>
              <CardDescription>
                Kid-friendly forms that encourage honest feedback
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-secondary/10 p-3 w-fit">
                <BrainIcon className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">AI Analysis</CardTitle>
              <CardDescription>
                Advanced sentiment analysis and insight extraction
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-accent/10 p-3 w-fit">
                <BarChart3Icon className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Smart Dashboard</CardTitle>
              <CardDescription>
                Visual insights with filtering by date and groups
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-success/10 p-3 w-fit">
                <UsersIcon className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-lg">Better Understanding</CardTitle>
              <CardDescription>
                Track classroom behavior and learning patterns
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold">Students Share</h3>
              <p className="text-muted-foreground">
                Students fill out simple reflection forms about their learning experience
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-lg">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold">AI Analyzes</h3>
              <p className="text-muted-foreground">
                Our AI processes responses to identify sentiment, key themes, and concerns
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-lg">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold">Teachers Act</h3>
              <p className="text-muted-foreground">
                Teachers get actionable insights to improve classroom experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;