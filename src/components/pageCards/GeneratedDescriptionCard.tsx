import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Markdown } from "../Markdown";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface GeneratedDescriptionCardProps {
  description: string;
  generateDescription: () => void;
  isLoading: boolean;
}

export const GeneratedDescriptionCard: React.FC<
  GeneratedDescriptionCardProps
> = ({ description, generateDescription, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[75%]" />
          <Button disabled className="mt-4">
            Generating...
          </Button>
        </div>
      );
    }

    if (description) {
      return (
        <>
          <ScrollArea className="w-full rounded-md p-4 mb-4">
            <Markdown content={description} />
          </ScrollArea>
          <Button onClick={generateDescription}>Regenerate Description</Button>
        </>
      );
    }

    return (
      <div>
        <p className="mb-2">No generated description available.</p>
        <Button onClick={generateDescription}>Generate Description</Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Description</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};
