import { Badge } from "@/components/ui/badge";

interface Props {

    status: string;

}

export function DatasetStatusBadge({

    status,

}: Props) {

    switch (status) {

        case "READY":

            return (
                <span>
                    Ready
                </span>
            );

        case "IMPORTING":

            return (
                <Badge>
                    Importing
                </Badge>
            );

        case "ARCHIVED":

            return (
                <Badge>
                    Archived
                </Badge>
            );

        default:

            return (
                <Badge>
                    Created
                </Badge>
            );

    }

}