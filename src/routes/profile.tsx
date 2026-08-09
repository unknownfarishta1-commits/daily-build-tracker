"use client";

import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, Camera, Save, ArrowLeft, Mail, Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppState, deriveStudent } from "@/lib/challenge-state";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { state, updateProfile } = useAppState();
  const student = deriveStudent(state);
  const navigate = useNavigate();
  
  const [name, setName] = React.useState(student.displayName);
  const [track, setTrack] = React.useState(student.track || "");
  const [isSaving, setIsSaving] = React.useState(false);

  // Sync state when student data changes (e.g. after hydration or updates)
  React.useEffect(() => {
    setName(student.displayName);
    setTrack(student.track || "");
  }, [student.displayName, student.track]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    setIsSaving(true);
    try {
      updateProfile({ name: name.trim(), track: track.trim() });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate({ to: "/dashboard" })}
            className="rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
        </div>

        <Card className="border-border/40 bg-secondary/20 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your public profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-border/40">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-4 border-primary/20 rounded-2xl">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {student.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Click to change avatar (Coming soon)</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Full Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-secondary/50 border-border/40 rounded-xl focus:border-primary/50 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Learning Track
                  </label>
                  <Input
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    placeholder="e.g. Full Stack Development"
                    className="bg-secondary/50 border-border/40 rounded-xl focus:border-primary/50 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 opacity-60">
                    <Mail className="h-4 w-4" /> Email Address
                  </label>
                  <Input
                    value={state.user?.email || ""}
                    disabled
                    className="bg-secondary/20 border-border/20 rounded-xl h-12 opacity-60 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground ml-1">Email cannot be changed.</p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-base font-semibold"
                >
                  {isSaving ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-5 w-5" /> Save Changes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-secondary/20 backdrop-blur-sm rounded-3xl overflow-hidden opacity-80">
          <CardHeader>
            <CardTitle className="text-lg">Account Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-lg font-bold">Aug 2026</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40">
              <p className="text-xs text-muted-foreground">Total Builds</p>
              <p className="text-lg font-bold">{student.completedDays}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
