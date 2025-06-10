// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UploadImage } from '@/lib/cloudinary/upload-image';

export async function POST(req: NextRequest) {
    const formData = await req.formData()

    const image = formData.get("image") as unknown as File;

    const data:any = await UploadImage(image, "nextjs-imagegallart")

    return NextResponse.json({
        msg: image
    }, {
        status: 200
    })
}
