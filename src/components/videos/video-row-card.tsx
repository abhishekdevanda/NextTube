import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { UserAvatar } from '../user-avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import VideoMenu from './video-section/VideoMenu';
import { VideoItem } from '@/data/types/videos-response-types';
import Image from 'next/image';
import { compactDate, compactNumber, formatDuration,} from '@/lib/formatData';

const VideoRowCardVariants = cva("group flex min-w-0", {
    variants: {
        size: {
            default: "gap-4",
            compact: "gap-2",
        }
    },
    defaultVariants: {
        size: "default",
    }
});

const ThumbnailVariants = cva("relative flex-none rounded-lg overflow-hidden", {
    variants: {
        size: {
            default: "w-[38%] aspect-video",
            compact: "w-[168px] h-[94px]",
        }
    },
    defaultVariants: {
        size: "default",
    }
});

interface VideoRowCardProps extends VariantProps<typeof VideoRowCardVariants> {
    video: VideoItem;
    // onRemove?: () => void;
}

// Helper function to format duration

export const VideoRowCard = ({ video, size='default' }: VideoRowCardProps) => {
    const formattedDuration = formatDuration(video.contentDetails?.duration || '');
    
    return (
        <div className={VideoRowCardVariants({ size })}>
            {/* Thumbnail Section */}
            <Link href={`/videos/${video.id}`} className={ThumbnailVariants({ size })+" relative"}>
                <Image
                    src={video.snippet.thumbnails.high.url || video.snippet.thumbnails.medium.url || video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    fill
                    priority
                    className="object-cover"
                    sizes={size === "compact" ? "168px" : "38vw"}
                />
                
                {/* Duration Badge */}
                {formattedDuration && (
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                        {formattedDuration}
                    </div>
                )}
            </Link>

            {/* Content Section */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-x-2">
                    <div className="flex-1 min-w-0">
                        <Link href={`/videos/${video.id}`}>
                            <h3 className={cn(
                                "font-medium line-clamp-2", 
                                size === "compact" ? "text-sm" : "text-base"
                            )}>
                                {video.snippet.title}
                            </h3>
                        </Link>
                        
                        {size === "default" && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {compactNumber(Number(video.statistics.viewCount))} views • {compactDate(video.snippet.publishedAt)}
                            </p>
                        )}
                        
                        {size === "default" && (
                            <>
                                <div className="flex items-center gap-2 mt-2 mb-1">
                                    <Link href={`/channel/${video.snippet.channelCustomUrl}`}>
                                        <UserAvatar
                                            size="sm"
                                            imageUrl={ video.snippet.channelThumbnail?.medium.url ||"/user-placeholder.svg"}
                                            name={video.snippet.channelTitle}
                                        />
                                    </Link>
                                    <Link 
                                        href={`/channel/${video.snippet.channelCustomUrl}`}
                                        className="text-sm text-muted-foreground "
                                    >
                                        {video.snippet.channelTitle}
                                    </Link>
                                </div>
                                
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-xs text-muted-foreground w-fit line-clamp-1 mt-1">
                                            {video.snippet.description}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="start" className="bg-black/70 max-w-xs">
                                        <p>From the video description</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}

                        {size === "compact" && (
                            <>
                                <Link 
                                    href={`/channel/${video.snippet.channelCustomUrl}`}
                                    className="text-xs text-muted-foreground hover:text-blue-500 mt-1 block"
                                >
                                    {video.snippet.channelTitle}
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                    {compactNumber(Number(video.statistics.viewCount))} views • {compactDate(video.snippet.publishedAt)}
                                </p>
                            </>
                        )}
                    </div>
                    
                    <div className="flex-none">
                        <VideoMenu videoId={video.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};
