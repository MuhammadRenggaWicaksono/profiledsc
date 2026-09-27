import { GetMemberById, PutMemberByid, DeleteMemberById } from "@/server/members";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return await GetMemberById(id)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return await PutMemberByid(req, id)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return await DeleteMemberById(id);
}