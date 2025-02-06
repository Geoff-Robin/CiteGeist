import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
export default function SkeletonFrame(){
    return(
        <div className="flex flex-1 flex-col gap-4 p-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                            className="aspect-video h-[150px] w-full rounded-lg bg-muted/50 flex flex-col gap-2"
                            >
                                 <Skeleton id ={index} className="h-4 w-1/2 ml-2 mt-4" />
                                 <Skeleton id ={index} className="h-4 w-1/4 ml-2" />
                                 <Separator></Separator>
                                 <Skeleton id ={index}className="h-4 mx-2 w-1/2" />
                                 <Skeleton id ={index} className="h-4 mx-2 w-3/4" />
                                 <Skeleton id ={index} className="h-4 mx-2 w-3/5" />
                            </div>
                        ))}
        </div>
    )
}