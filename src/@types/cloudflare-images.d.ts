declare module "cloudflare-images" {
    export = Cloudflare;
    namespace Cloudflare {

        export interface UsageStats {
            count: {
                current: number
                allowed: number
            }
        }

        export type Metadata = Record<string, any>

        // =====================================================================
        // Logging
        // =====================================================================
        export namespace Logging {
            export type LogFunction = (message?: any, ...optionalParams: any[]) => void

            export interface ILogger {
                trace: LogFunction
                debug: LogFunction
                info:  LogFunction
                warn:  LogFunction
                error: LogFunction
                // fatal?: LogFunction
            }
        }

        // =====================================================================
        // Images
        // =====================================================================
        export namespace Images {
            export interface Image {
                /**
                 * Image unique identifier.
                 * Max length: `32`
                 * Read only.
                 */
                id: string
                /**
                 * Image file name.
                 * Max length: `32`
                 * Read only.
                 */
                filename: string
                /**
                 * When the media item was uploaded.
                 */
                uploaded: string
                /**
                 * Indicates whether the image can be accessed using only its UID.
                 *
                 * If set to `true`, a signed token needs to be generated with a signing key to view the image.
                 */
                requireSignedURLs: boolean
                /**
                 * Object specifying available variants for an image.
                 * Read only.
                 */
                variants: string[]
                /**
                 * User modifiable key-value store.
                 * Can use used for keeping references to another system of record for managing images.
                 * Read only.
                 */
                metadata?: Metadata
            }

            export interface ImageList {
                images: Image[]
            }
        }

        // =====================================================================
        // Variants
        // =====================================================================
        export namespace Variants {
            export namespace VariantFits {
                /**
                 * Image will be shrunk in size to fully fit within the given width or height,
                 * but will not be enlarged.
                 */
                export type ScaleDown = "scale-down"
                /**
                 * Image will be resized (shrunk or enlarged) to be as large as possible within
                 * the given width or height while preserving the aspect ratio.
                 */
                export type Contain = "contain"
                /**
                 * Image will be resized to exactly fill the entire area specified by
                 * width and height, and will be cropped if necessary.
                 */
                export type Cover = "cover"
                /**
                 * Image will be shrunk and cropped to fit within the area specified by width and height.
                 * The image will not be enlarged.
                 * For images smaller than the given dimensions it is the same as `scale-down`.
                 * For images larger than the given dimensions, it is the same as `cover`.
                 */
                export type Crop = "crop"
                /**
                 * Image will be resized (shrunk or enlarged) to be as large as possible within the
                 * given width or height while preserving the aspect ratio, and the extra area will
                 * be filled with a background color (white by default).
                 */
                export type Pad = "pad"
            }

            /** The fit property describes how the width and height dimensions should be interpreted. */
            export type VariantFit =
                | VariantFits.ScaleDown
                | VariantFits.Contain
                | VariantFits.Cover
                | VariantFits.Crop
                | VariantFits.Pad

            export interface Variant {
                /** API item identifier tag. */
                id: string
                /** Allows you to define image resizing sizes for different use cases. */
                options: {
                    /** The fit property describes how the width and height dimensions should be interpreted. */
                    fit: VariantFit
                    /** What EXIF data should be preserved in the output image. */
                    metadata?: "keep" | "copyright" | "none"
                    /** Maximum width in image pixels. */
                    width: number
                    /** Maximum height in image pixels. */
                    height: number
                    /** Indicates whether the variant can access an image without a signature, regardless of image access control. */
                    neverRequireSignedURLs?: boolean
                }
            }

            export interface VariantList {
                variants: { [key: string]: Variant }
            }
        }

        // =====================================================================
        // Responses
        // =====================================================================
        export namespace Responses {
            export interface Response<T = any> {
                result: T
                result_info: any
                success: boolean
                errors: any[]
                messages: any[]
            }
            export type UploadImage     = Response<Images.Image>
            export type DeleteImage     = Response<undefined>
            export type ListImages      = Response<Images.ImageList>
            export type ImageDetails    = Response<ImageData>
            export type VariantDetails  = Response<Variants.Variant>
            export type ListVariants    = Response<Variants.VariantList>
            export type UsageStatistics = Response<UsageStats>
            export type DeleteVariant   = Response<undefined>
        }

        // =====================================================================
        // Requests
        // =====================================================================
        export namespace Requests {
            export interface ImageUpload {
                id: string
                fileName: string
                fileData: Blob
                /**
                 * User modifiable key-value store.
                 * Can use used for keeping references to another system of record for managing images.
                 * @default {}
                 */
                metadata?: Metadata
                /**
                 * Indicates whether the image requires a signature token for the access.
                 * @default false
                 */
                requireSignedURLs?: boolean
                // /**
                //  * A URL to fetch an image from origin.
                //  * Mutually exclusive with `file` parameter.
                //  */
                // url?: string
            }
            export interface ListImages {
                /**
                 * Page number.
                 * @default 1
                 */
                page?: number
                /**
                 * Number of results per page.
                 * Min of 10, max of 100.
                 * @default 100
                 */
                per_page?: number
            }
            export interface UpdateImage {
                /**
                 * User modifiable key-value store.
                 * Can use used for keeping references to another system of record for managing images.
                 */
                metadata?: Metadata
                /**
                 * Indicates whether the image requires a signature token for the access.
                 */
                requireSignedURLs?: boolean
            }
            export interface CreateVariant extends Variants.Variant { }
            export interface UpdateVariant extends Variants.Variant { }
        }

        // =========================================================================
        // Client
        // =========================================================================
        export interface Credentials {
            /**
             * API key generated on the [My Account](https://dash.cloudflare.com/profile/api-tokens) page.
             */
            apiKey: string
            accountId: string
        }

        export interface CloudflareClientOptions extends Credentials {
            logger?: Logging.ILogger
            logRequests?: boolean
            logErrors?: boolean
        }

        export class CloudflareClient {
            constructor(options: CloudflareClientOptions)
            // -----------------------------------------------------------------
            // Images
            // -----------------------------------------------------------------
            /**
             * Upload an image with up to 10 Megabytes using a single HTTP POST (multipart/form-data) request.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-upload-an-image-using-a-single-http-request)
             */
            uploadImage(request: Requests.ImageUpload): Promise<Responses.UploadImage>
            /**
             * List up to 100 images with one request.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-list-images)
             */
            listImages(request: Requests.ListImages): Promise<Responses.ListImages>
            /**
             * Fetch details for a single image.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-image-details)
             */
            getImage(imageId: string): Promise<Responses.ImageDetails>
            // /**
            //  * Fetch base image.
            //  * For most images this will be the originally uploaded file.
            //  * For larger images it can be a near-lossless version of the original.
            //  *
            //  * [API Docs](https://api.cloudflare.com/#cloudflare-images-base-image)
            //  */
            // getImageBase(imageId: string): Promise<Blob>
            // /**
            //  * Update image.
            //  *
            //  * Update image access control. On access control change, all copies of the image are purged from cache.
            //  *
            //  * [API Docs](https://api.cloudflare.com/#cloudflare-images-update-image)
            //  */
            // updateImage(imageId: string, options: Requests.UpdateImage): Promise<Responses.ImageDetails>
            /**
             * Delete an image on Cloudflare Images. On success, all copies of the image are deleted and purged from cache.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-delete-image)
             */
            deleteImage(imageId: string): Promise<Responses.DeleteImage>
            // -----------------------------------------------------------------
            // Variants
            // -----------------------------------------------------------------
            /**
             * Create a new image variant that allows you to resize images for different use cases.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-create-a-variant)
             * [Cloudflare Docs](https://developers.cloudflare.com/images/cloudflare-images/transform/resize-images/)
             */
            createVariant(options: Requests.CreateVariant): Promise<Responses.VariantDetails>
            /**
             * Lists existing variants.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-list-variants)
             */
            listVariants(): Promise<Responses.ListVariants>
            /**
             * Fetch details for a single variant.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-variant-details)
             */
            getVariant(variantId: string): Promise<Responses.VariantDetails>
            /**
             * Update an existing variant.
             *
             * Updating a variant purges the cache for all images associated with the variant.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-update-a-variant)
             * [Cloudflare Docs](https://developers.cloudflare.com/images/cloudflare-images/transform/resize-images/)
             */
            updateVariant(variantId: string, options: Requests.UpdateVariant): Promise<Responses.VariantDetails>
            /**
             * Delete a variant.
             *
             * Deleting a variant purges the cache for all images associated with the variant.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-variants-delete-a-variant)
             */
            deleteVariant(variantId: string): Promise<Responses.DeleteVariant>
            // -----------------------------------------------------------------
            // Misc.
            // -----------------------------------------------------------------
            /**
             * Fetch usage statistics details for Cloudflare Images.
             *
             * [API Docs](https://api.cloudflare.com/#cloudflare-images-images-usage-statistics)
             */
            getStats(): Promise<Responses.UsageStatistics>
        }

    }
}
