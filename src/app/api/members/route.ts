import { GetMember, PostMember} from '@/server/members'

export async function GET() {
    return await GetMember()
}

export async function POST(req: Request) {
    return await PostMember(req)
}

