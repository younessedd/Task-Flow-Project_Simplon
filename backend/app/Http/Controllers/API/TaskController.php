<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // جلب جميع المهام مع أسماء المنشئ والمُسند إليه
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->is_admin) {
            $tasks = Task::with(['creator', 'assignee'])->get();
        } else {
            $tasks = Task::with(['creator', 'assignee'])
                ->where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id)
                ->get();
        }

        $tasks = $tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'start_date' => $task->start_date,
                'end_date' => $task->end_date,
                'status' => $task->status,
                'created_by' => $task->created_by,
                'assigned_to' => $task->assigned_to,
                'creator_name' => $task->creator ? $task->creator->name : null,
                'assignee_name' => $task->assignee ? $task->assignee->name : ($task->creator ? $task->creator->name : null),
            ];
        });

        return response()->json($tasks);
    }

    // إنشاء مهمة جديدة
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $user = $request->user();

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'todo',
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'assigned_to' => $request->assigned_to ?? $user->id,
            'created_by' => $user->id,
        ]);

        return response()->json($task);
    }

    // عرض مهمة واحدة
    public function show($id)
    {
        $task = Task::with(['creator', 'assignee'])->findOrFail($id);
        return response()->json($task);
    }

    // تعديل مهمة
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = $request->user();

        if (!$user->is_admin && $task->created_by != $user->id && $task->assigned_to != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'assigned_to' => $request->assigned_to ?? $task->assigned_to,
            'status' => $request->status ?? $task->status,
        ]);

        return response()->json($task);
    }

    // حذف مهمة
    public function destroy(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = $request->user();

        if (!$user->is_admin && $task->created_by != $user->id && $task->assigned_to != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // تغيير حالة المهمة (زر واحد فقط)
    public function changeStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $user = $request->user();

        if (!$user->is_admin && $task->created_by != $user->id && $task->assigned_to != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $nextStatus = match ($task->status) {
            'todo' => 'in_progress',
            'in_progress' => 'done',
            'done' => 'todo',
        };

        $task->status = $nextStatus;
        $task->save();

        return response()->json($task);
    }
}
