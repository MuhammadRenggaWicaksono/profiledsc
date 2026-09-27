import { supabase, supabaseAdmin } from '@/lib/supabase';
import { response, errorResponse } from '@/utils/response'
import { uploadImage, deleteImage } from '@/utils/uploadImage';

export const GetMember = async () => {
    const { data, error } = await supabaseAdmin
        .from("members")
        .select("*")

    if (error) {
        return errorResponse(500, error.message)
    }
    return response(200, "donebang", data)
}

export const GetMemberById = async (id: string) => {
    const { data, error } = await supabaseAdmin
        .from('members')
        .select('*')
        .eq("id", id)
        .single()
    if (error) {
        return errorResponse(500, error.message)
    }
    return response(200, `Detail data member DSC: ${data.name}`, data)
}

export const PostMember = async (req: Request) => {
    try {
        //Request tidak dalam bentuk body.json lagi tapi form-data
        const formData = await req.formData()
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const photo_url = formData.get("photo_url") as File;
        const social_links = formData.get("social_links") as string;
        const points = Number(formData.get("points"));

        if (!name || !role) {
            return errorResponse(400, "kolom nama atau role/jabatan tidak boleh kosong")
        }

        let fileName = null;
        if (photo_url instanceof File && photo_url.size > 0) {
            fileName = await uploadImage(photo_url)
        }

        const { data, error } = await supabaseAdmin
            .from('members')
            .insert({
                name,
                role,
                photo_url: fileName,
                social_links,
                points
            })
            .select()
            .single();
        if (error) {
            return errorResponse(500, error.message)
        }
        return response(200, "Berhasil menambahkan data aggota DSC", data)
    } catch (error) {
        console.log(error)
        return errorResponse(500, "gagal upload gambar")
    }
}

export const PutMemberByid = async (req: Request, id: string) => {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const photo = formData.get("photo_url");
        const social_links = formData.get("social_links") as string;
        const points = Number(formData.get("points"));
        const removePhoto = formData.get("remove_photo") === "true";

        // 1. Ambil data member lama
        const { data: oldMember, error: findError } = await supabaseAdmin
            .from("members")
            .select("id, photo_url")
            .eq("id", id)
            .single();

        if (findError) {
            return errorResponse(500, findError.message);
        }

        if (!oldMember) {
            return errorResponse(
                404,
                "Data member tidak ditemukan!"
            );
        }

        const oldPhoto = oldMember.photo_url;

        // 2. Cek apakah ada foto baru
        const hasNewPhoto =
            photo instanceof File && photo.size > 0;

        // Tidak boleh hapus dan upload foto sekaligus
        if (removePhoto && hasNewPhoto) {
            return errorResponse(
                400,
                "Tidak dapat menghapus dan mengganti foto secara bersamaan"
            );
        }

        // 3. Data yang akan di-update
        const updateData: Record<string, unknown> = {
            name,
            role,
            social_links,
            points
        };

        // =========================================
        // KONDISI A: User upload foto baru
        // =========================================
        if (hasNewPhoto) {
            const newFileName = await uploadImage(photo);

            updateData.photo_url = newFileName;

            // Update database terlebih dahulu
            const { data, error } = await supabaseAdmin
                .from("members")
                .update(updateData)
                .eq("id", id)
                .select()
                .single();

            if (error) {
                // Kalau DB gagal, hapus foto baru
                await deleteImage(newFileName);

                return errorResponse(
                    500,
                    error.message
                );
            }

            // Setelah DB berhasil, hapus foto lama
            if (oldPhoto) {
                await deleteImage(oldPhoto);
            }

            return response(
                200,
                "Berhasil mengubah data anggota DSC",
                data
            );
        }

        // =========================================
        // KONDISI B: User ingin menghapus foto
        // =========================================
        if (removePhoto) {

            if (oldPhoto) {
                await deleteImage(oldPhoto);
            }

            updateData.photo_url = null;
        }

        // =========================================
        // KONDISI C:
        // Tidak ada foto baru dan tidak hapus foto
        // → photo_url tidak disentuh
        // =========================================

        const { data, error } = await supabaseAdmin
            .from("members")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return errorResponse(
                500,
                error.message
            );
        }

        return response(
            200,
            "Berhasil mengubah data anggota DSC",
            data
        );

    } catch (error) {
        console.error(error);

        return errorResponse(
            500,
            error instanceof Error
                ? error.message
                : "Gagal mengubah data anggota"
        );
    }
};


export const DeleteMemberById = async (id: string) => {
    const { data, error } = await supabaseAdmin
        .from('members')
        .delete()
        .eq("id", id)
        .select()
        .single()

    if (error) {
        return errorResponse(500, error.message)
    }
    return response(200, "Berhasil menghapus data", data)
}