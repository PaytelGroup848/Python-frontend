"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {

    open: boolean;

    recordId: number | null;

    onClose(): void;

    onDelete(): Promise<void>;

}

export function DeleteRecordDialog({

    open,

    recordId,

    onClose,

    onDelete,

}: Props) {

    return (

        <Dialog

            open={open}

            onOpenChange={(value) => {

                if (!value) {

                    onClose();

                }

            }}

        >

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>

                        Delete Record

                    </DialogTitle>

                    <DialogDescription>

                        This action cannot be undone.

                    </DialogDescription>

                </DialogHeader>

                <div className="py-2">

                    Are you sure you want to delete record{" "}

                    <strong>

                        #{recordId}

                    </strong>

                    ?

                </div>

                <DialogFooter>

                    <Button

                        variant="outline"

                        onClick={onClose}

                    >

                        Cancel

                    </Button>

                    <Button

                        variant="destructive"

                        onClick={onDelete}

                    >

                        Delete

                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}