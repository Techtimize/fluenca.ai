import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { UploadAttachmentApi } from "./chatbot.routes";
import { getApiErrorMessage } from "@/errors/error-utils";

export function UploadAttachmentMutation() {
  return useMutation({
    mutationFn: (file: File) => UploadAttachmentApi(file),
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not upload the image"));
    },
  });
}
