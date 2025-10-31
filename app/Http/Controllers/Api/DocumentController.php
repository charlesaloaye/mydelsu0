<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    public function usage(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'data' => [
                'used_bytes' => (int) $user->storage_used_bytes,
                'quota_bytes' => (int) $user->storage_quota_bytes,
            ],
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Document::where('user_id', $user->id)->orderByDesc('created_at');

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        $documents = $query->paginate($request->get('per_page', 50));

        return response()->json([
            'success' => true,
            'data' => $documents,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $file = $request->file('file');
        $size = $file->getSize();

        // Quota check
        $newTotal = ((int) $user->storage_used_bytes) + $size;
        if ($newTotal > (int) $user->storage_quota_bytes) {
            return response()->json([
                'success' => false,
                'message' => 'Storage quota exceeded',
            ], 413);
        }

        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('user_documents/' . $user->id, $filename, 'public');

        $doc = Document::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'category' => $request->category,
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $size,
            'file_path' => $path,
            'file_name' => $filename,
            'uploaded_by' => 'student',
        ]);

        $user->update(['storage_used_bytes' => $newTotal]);

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'data' => $doc,
        ], 201);
    }

    public function rename(Request $request, int $id)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $doc = Document::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $doc->update(['name' => $request->name]);
        return response()->json(['success' => true, 'data' => $doc]);
    }

    public function destroy(Request $request, int $id)
    {
        $doc = Document::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        // Delete file
        if ($doc->file_path) {
            Storage::disk('public')->delete($doc->file_path);
        }

        // Decrement usage
        $user = $request->user();
        $newUsed = max(0, ((int) $user->storage_used_bytes) - (int) $doc->file_size);
        $user->update(['storage_used_bytes' => $newUsed]);

        $doc->delete();

        return response()->json(['success' => true, 'message' => 'Document deleted']);
    }

    public function download(Request $request, int $id)
    {
        $doc = Document::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $fullPath = storage_path('app/public/' . $doc->file_path);
        return response()->download($fullPath, $doc->file_name);
    }
}
