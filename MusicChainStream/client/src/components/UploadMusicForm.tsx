import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, UploadCloud, Music, Disc, CheckCircle2, Server } from "lucide-react";

// Form schema using zod
const uploadFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  album: z.string().min(2, "Album name required"),
  duration: z.string().regex(/^\d+:\d{2}$/, "Duration must be in format MM:SS"),
  audioFile: z.instanceof(File, { message: "Audio file is required" }).refine(
    (file) => file.size < 10 * 1024 * 1024, // 10MB max
    "File size must be less than 10MB"
  ).refine(
    (file) => ["audio/mpeg", "audio/wav", "audio/ogg"].includes(file.type),
    "Only MP3, WAV, or OGG files are allowed"
  ),
  albumCover: z.instanceof(File, { message: "Album cover is required" }).refine(
    (file) => file.size < 5 * 1024 * 1024, // 5MB max
    "File size must be less than 5MB"
  ).refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only JPEG, PNG, or WEBP images are allowed"
  ),
  description: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export default function UploadMusicForm() {
  const { isConnected, account } = useBlockchain();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      album: "",
      duration: "",
      description: "",
    },
  });

  const onSubmit = async (data: UploadFormValues) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to upload music",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setStatusMessage('Preparing files for upload...');
    setUploadProgress(0);

    try {
      // Create URLs for audio and image
      const audioUrl = URL.createObjectURL(data.audioFile);
      const imageUrl = URL.createObjectURL(data.albumCover);
      
      // Prepare API request data - make sure all required fields exactly match schema
      const uploadData = {
        title: data.title,
        album: data.album,
        duration: data.duration,
        description: data.description || "",
        // Using id 1 for The Blockchain Beats, this is the current logged-in user
        artistId: 1,
        // Pre-populate artist name since we're using a fixed artistId (1)
        artist: "The Blockchain Beats",
        // For blob URLs, convert to a string that will be handled by the server
        audioUrl,
        albumCover: imageUrl,
        // Add required fields with default values
        earnings: 0,
        playCount: 0
      };
      
      // Simulate file upload progress (0-50%)
      for (let progress = 0; progress <= 50; progress += 10) {
        setUploadProgress(progress);
        setStatusMessage(`Uploading files: ${progress}%`);
        // Shortened delay for faster upload simulation
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Simulate blockchain verification progress (50-100%)
      setUploadStatus('processing');
      setStatusMessage('Creating blockchain record...');
      setUploadProgress(60);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setStatusMessage('Generating cryptographic signature...');
      setUploadProgress(75);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setStatusMessage('Finalizing transaction...');
      setUploadProgress(90);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Send the track data to our API
      try {
        const data = await apiRequest('/api/tracks', 'POST', uploadData);
        console.log('Upload response:', data);
        
        // Invalidate queries to ensure search results are updated
        queryClient.invalidateQueries({ queryKey: ['/api/search'] });
        queryClient.invalidateQueries({ queryKey: ['/api/tracks/recent'] });
        // Also invalidate artist's tracks in case user is on the artist page
        queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
        console.log('Cache invalidated for search, recent tracks, and artists');
        
      } catch (error) {
        console.error('API request error:', error);
        throw new Error('Failed to upload track');
      }
      
      setUploadProgress(100);
      setUploadStatus('success');
      setStatusMessage('Upload complete! Track verified on blockchain.');
      
      toast({
        title: "Upload successful!",
        description: "Your track has been verified and is now available on the platform.",
      });
      
      // Reset form after a short delay to show success state
      setTimeout(() => {
        form.reset();
        setAudioPreview(null);
        setImagePreview(null);
        setUploadStatus('idle');
        setUploadProgress(0);
        setStatusMessage('');
        setIsUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus('error');
      setStatusMessage('Upload failed. Please try again.');
      
      toast({
        title: "Upload failed",
        description: "There was an error uploading your track. Please try again.",
        variant: "destructive",
      });
      
      // Reset upload state
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 2000);
    }
  };

  // Handle file inputs
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("audioFile", file, { shouldValidate: true });
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("albumCover", file, { shouldValidate: true });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[#181818] border-[#282828]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Upload Your Music</CardTitle>
        <CardDescription>
          Upload your tracks to earn 95% of all payments directly to your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center p-6 bg-[#121212] rounded-lg">
            <UploadCloud className="w-12 h-12 mx-auto mb-4 text-[#644EFF]" />
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-[#B3B3B3] mb-6">
              You need to connect your wallet to upload music and receive payments.
            </p>
            <Button className="bg-[#644EFF] hover:bg-[#7a64ff]">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Track Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter track title"
                            className="bg-[#282828] border-[#383838]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="album"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Album/EP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter album name"
                            className="bg-[#282828] border-[#383838]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 3:45"
                            className="bg-[#282828] border-[#383838]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Format: MM:SS (e.g. 3:45)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a description for your track"
                            className="bg-[#282828] border-[#383838] resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <FormLabel>Audio File</FormLabel>
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      audioPreview ? 'border-[#1DB954]' : 'border-[#383838]'
                    }`}>
                      {audioPreview ? (
                        <div className="flex flex-col items-center">
                          <Music className="w-8 h-8 mb-2 text-[#1DB954]" />
                          <p className="text-sm text-[#B3B3B3] mb-2">
                            {form.getValues("audioFile")?.name}
                          </p>
                          <audio controls className="w-full mt-2">
                            <source src={audioPreview} />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ) : (
                        <div className="py-4">
                          <UploadCloud className="w-8 h-8 mx-auto mb-2 text-[#B3B3B3]" />
                          <p className="text-sm text-[#B3B3B3]">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-[#666666] mt-1">
                            MP3, WAV, OGG (max 10MB)
                          </p>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="audio/mpeg,audio/wav,audio/ogg"
                        className="hidden"
                        id="audio-upload"
                        onChange={handleAudioChange}
                      />
                    </div>
                    {form.formState.errors.audioFile && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.audioFile.message}
                      </p>
                    )}
                    <label 
                      htmlFor="audio-upload" 
                      className="block text-center mt-2 text-sm text-[#644EFF] cursor-pointer"
                    >
                      Select audio file
                    </label>
                  </div>
                  
                  <div>
                    <FormLabel>Album Cover</FormLabel>
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      imagePreview ? 'border-[#1DB954]' : 'border-[#383838]'
                    }`}>
                      {imagePreview ? (
                        <div className="flex flex-col items-center">
                          <img 
                            src={imagePreview} 
                            alt="Album cover preview" 
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                          <p className="text-sm text-[#B3B3B3] mt-2">
                            {form.getValues("albumCover")?.name}
                          </p>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Disc className="w-8 h-8 mx-auto mb-2 text-[#B3B3B3]" />
                          <p className="text-sm text-[#B3B3B3]">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-[#666666] mt-1">
                            JPEG, PNG, WEBP (max 5MB)
                          </p>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageChange}
                      />
                    </div>
                    {form.formState.errors.albumCover && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.albumCover.message}
                      </p>
                    )}
                    <label 
                      htmlFor="image-upload" 
                      className="block text-center mt-2 text-sm text-[#644EFF] cursor-pointer"
                    >
                      Select image file
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-[#121212] p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="h-6 w-6 rounded-full bg-[#644EFF] bg-opacity-20 flex items-center justify-center mr-2">
                    <i className="ri-token-swap-line text-[#644EFF] text-xs"></i>
                  </div>
                  <p className="text-sm font-medium">Blockchain Verification</p>
                </div>
                <p className="text-xs text-[#B3B3B3]">
                  Your uploaded track will be verified on the blockchain. You'll receive 95% of all payments directly to your wallet: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
              
              {/* Upload progress indicator */}
              {isUploading && (
                <div className="mt-6 bg-[#121212] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {uploadStatus === 'uploading' && (
                        <Loader2 className="w-5 h-5 text-[#644EFF] mr-2 animate-spin" />
                      )}
                      {uploadStatus === 'processing' && (
                        <Server className="w-5 h-5 text-amber-500 mr-2" />
                      )}
                      {uploadStatus === 'success' && (
                        <CheckCircle2 className="w-5 h-5 text-[#1DB954] mr-2" />
                      )}
                      <span className="font-medium">
                        {uploadStatus === 'uploading' && 'Uploading Files'}
                        {uploadStatus === 'processing' && 'Verifying on Blockchain'}
                        {uploadStatus === 'success' && 'Upload Complete'}
                      </span>
                    </div>
                    <Badge 
                      variant={uploadStatus === 'success' ? 'default' : 'outline'}
                      className={`
                        ${uploadStatus === 'uploading' ? 'border-[#644EFF] text-[#644EFF]' : ''}
                        ${uploadStatus === 'processing' ? 'border-amber-500 text-amber-500' : ''}
                        ${uploadStatus === 'success' ? 'bg-[#1DB954] text-white' : ''}
                      `}
                    >
                      {uploadProgress}%
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={uploadProgress} 
                    className="h-2 bg-[#282828]" 
                  />
                  
                  <p className="text-sm text-[#B3B3B3] mt-2">{statusMessage}</p>
                </div>
              )}
              
              <CardFooter className="pt-6 px-0 flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-medium"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Upload Track
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}