
<script setup>
import {useAvatarUrl} from "~/composables/useAvatarUrl.js";

const supabase = useSupabaseClient()
const user = useSupabaseUser()
import { v4 as uuidv4 } from 'uuid';

// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast()

const uploading = ref(false)
const fileInput = ref() // Reference to an input with ref="fileInput" attribute

const saveAvatar = async () => {
    // 1. Get the uploaded file
    //    a) If no file uploaded, show toast error
    // 2. Generate the new filename
    const file = fileInput.value.input.files[0]

    if (!file) {
        toastError({title: 'Select the file to upload first'})
        return
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${uuidv4()}.${fileExt}`

    try {
        uploading.value = true
        // 1. Grab the current avatar URL
        const currentAvatarUrl = user.value.user_metadata?.avatar_url

        // 2. Upload the image to avatars bucket
        const { data, error } = await supabase
            .storage
            .from('public_assets')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            })
        if (error) throw error

        // 3. Update the user metadata with the avatar URL
        await supabase.auth.updateUser({
            data: {
                avatar_url: fileName
            }
        })

        // 4. (OPTIONALLY) remove the old avatar file
        if (currentAvatarUrl) {
            const { data, error } = await supabase
                .storage
                .from('public_assets')
                .remove([currentAvatarUrl])

            if (error) throw error
        }

        // 5. Reset the file input
        fileInput.value.input.value = null
        toastSuccess({
            title: 'Avatar uploaded',
        })
    } catch (error) {
        toastError({
            title: 'Error uploading avatar',
            description: error.message
        })
    } finally {
        uploading.value = false
    }
}

const { url } = useAvatarUrl()
</script>

<template>
    <div>
        <div class="mb-4">
            <UFormGroup label="Current avatar" class="w-full" help="This would be blank by default">
                <UAvatar :src="url" size="3xl" alt="User avatar" />
            </UFormGroup>
        </div>

        <div class="mb-4">
            <UFormGroup label="New avatar" class="w-full" name="avatar"
                        help="After choosing an image click Save to actually upload the new avatar">
                <UInput type="file" ref="fileInput" />
            </UFormGroup>
        </div>

        <UButton type="submit" color="black" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
                 @click="saveAvatar" />
    </div>
</template>
