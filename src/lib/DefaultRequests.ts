import { Requests, Operation } from "cloudflare-images"

const image_upload: Requests.CreateImage = {
    id: null,
    fileName: null,
    fileData: null,
    metadata: {
        updatedAt: new Date().toISOString(),
    },
    requireSignedURLs: false,
}

const image_update: Requests.UpdateImage = {
    metadata: {
        updatedAt: new Date().toISOString(),
    },
}

const image_list: Requests.ListImages = {
    page: 1,
    per_page: 100,
}

export const DefaultRequests: Record<Operation, any> = {
    "image.create":        image_upload,
    "image.list":          image_list,
    "image.get":           {},
    "image.update":        image_update,
    "image.delete":        {},
    "variant.list":        {},
    "variant.get":         {},
    "variant.create":      {},
    "variant.update":      {},
    "variant.delete":      {},
    "usageStatistics.get": {},
}
