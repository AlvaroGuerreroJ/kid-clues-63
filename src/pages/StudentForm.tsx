import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const StudentForm = () => {
  const [studentName, setStudentName] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [responses, setResponses] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
  });
  const { toast } = useToast();

  const questions = [
    "How did you feel about today's lesson?",
    "What was the most interesting thing you learned?",
    "Was there anything you found difficult to understand?",
    "How well did you work with your classmates today?",
  ];

  const handleResponseChange = (questionKey: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName || !studentGroup) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and select your group.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Responses Submitted!",
      description: "Thank you for sharing your thoughts with us.",
    });

    // Reset form
    setStudentName("");
    setStudentGroup("");
    setResponses({
      question1: "",
      question2: "",
      question3: "",
      question4: "",
    });
  };

  return (
    <div className="min-h-screen bg-student-bg p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            📝 Daily Reflection
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts about today's learning experience
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-primary">Tell us about yourself</CardTitle>
            <CardDescription>
              First, let us know who you are
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name"
                  className="transition-all duration-200 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Your Group</Label>
                <Select value={studentGroup} onValueChange={setStudentGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group-a">Group A - Dolphins</SelectItem>
                    <SelectItem value="group-b">Group B - Eagles</SelectItem>
                    <SelectItem value="group-c">Group C - Lions</SelectItem>
                    <SelectItem value="group-d">Group D - Owls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {questions.map((question, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg text-secondary">
                  Question {index + 1}
                </CardTitle>
                <CardDescription className="text-base">
                  {question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={responses[`question${index + 1}` as keyof typeof responses]}
                  onChange={(e) => handleResponseChange(`question${index + 1}`, e.target.value)}
                  placeholder="Write your answer here..."
                  className="min-h-[100px] transition-all duration-200 focus:ring-secondary/20"
                  rows={4}
                />
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button 
              type="submit" 
              variant="student"
              className="w-full sm:w-auto"
            >
              Submit My Responses ✨
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;