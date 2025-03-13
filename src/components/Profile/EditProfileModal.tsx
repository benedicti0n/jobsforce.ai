import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Github, Linkedin, MapPin, PhoneCall, SquareArrowOutUpRight } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/Button'
import { useModalStore, useLoadingStore } from '@/store'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

const EditProfileModal = (userDetails) => {
    const { isEditOpen, openModal, closeModal } = useModalStore();
    const { isLoading, startLoading, finishLoading } = useLoadingStore()

    const initialSkills = userDetails?.skills?.join(", ") || "";
    const initialPreferredJobs = userDetails?.preferredJob?.join(", ") || "";

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const token = Cookies.get("token");
            const formData = new FormData(e.currentTarget);

            // Extract form data to match the backend's expected structure
            const updatedData = {
                github: formData.get("github") as string || "",
                linkdin: formData.get("linkdin") as string || "",
                portfolio: formData.get("portfolio") as string || "",
                currentLocation: formData.get("currentLocation") as string || "",
                contact: parseInt(formData.get("contact") as string) || 0,
                skills: (formData.get("skills") as string)?.split(",").map((skill) => skill.trim()).filter(Boolean) || [],
                preferredJob: (formData.get("preferredJob") as string)?.split(",").map((job) => job.trim()).filter(Boolean) || [],
            };

            startLoading();

            const response = await fetch(
                "https://api.jobsforce.ai/api/details",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `${token}`,
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success("Profile updated successfully!");
                closeModal();
                window.location.reload();
            } else {
                toast.warning(`Failed to update profile: ${result.message}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            finishLoading();
        }
    };

    return (
        <Dialog open={isEditOpen} onOpenChange={closeModal}>
            <DialogContent className="w-[95%] max-w-[900px] h-[90vh] md:h-[80vh] overflow-y-auto p-4 md:p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl md:text-2xl">
                        Edit Profile
                    </DialogTitle>
                    <DialogDescription>
                        Update your profile information and preferences
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="socials"
                                    className="text-base font-semibold"
                                >
                                    Social Links
                                </Label>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="github"
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <Github className="h-4 w-4" />
                                            GitHub Profile
                                        </Label>
                                        <Input
                                            id="github"
                                            name="github"
                                            placeholder="https://github.com/username"
                                            defaultValue={userDetails?.github || ""}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="linkedin"
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                            LinkedIn Profile
                                        </Label>
                                        <Input
                                            id="linkedin"
                                            name="linkdin"
                                            placeholder="https://linkedin.com/in/username"
                                            defaultValue={userDetails?.linkdin || ""}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="portfolio"
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <SquareArrowOutUpRight className="h-4 w-4" />
                                            Portfolio Website
                                        </Label>
                                        <Input
                                            id="portfolio"
                                            name="portfolio"
                                            placeholder="https://yourportfolio.com"
                                            defaultValue={userDetails?.portfolio || ""}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="personal"
                                    className="text-base font-semibold"
                                >
                                    Personal Information
                                </Label>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="location"
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            Current Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="currentLocation"
                                            placeholder="City, Country"
                                            defaultValue={userDetails?.currentLocation || ""}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="contact"
                                            className="text-sm flex items-center gap-2"
                                        >
                                            <PhoneCall className="h-4 w-4" />
                                            Contact Number
                                        </Label>
                                        <Input
                                            id="contact"
                                            name="contact"
                                            type="number"
                                            placeholder="Your phone number"
                                            defaultValue={userDetails?.contact || ""}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="professional"
                                    className="text-base font-semibold"
                                >
                                    Professional Details
                                </Label>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="skills" className="text-sm">
                                            Skills
                                        </Label>
                                        <Input
                                            id="skills"
                                            name="skills"
                                            placeholder="React, Node.js, TypeScript"
                                            defaultValue={initialSkills}
                                            className="h-9"
                                        />
                                        <span className="text-xs text-gray-500">
                                            Separate skills with commas
                                        </span>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="preferredJob" className="text-sm">
                                            Preferred Jobs
                                        </Label>
                                        <Input
                                            id="preferredJob"
                                            name="preferredJob"
                                            placeholder="Frontend Developer, Full Stack Developer"
                                            defaultValue={initialPreferredJobs}
                                            className="h-9"
                                        />
                                        <span className="text-xs text-gray-500">
                                            Separate job titles with commas
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6 flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => closeModal()}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin mr-2">⚪</span>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileModal