<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        // Admin sees all, user sees all but CRUD only on own/assigned
        return Task::with(['creator','assignee'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        if (!$data['assigned_to']) $data['assigned_to'] = Auth::id();

        $task = Task::create(array_merge($data, ['created_by' => Auth::id(), 'status' => 'todo']));

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return $task->load(['creator','assignee']);
    }

    public function update(Request $request, Task $task)
    {
        if(Auth::user()->is_admin || $task->created_by == Auth::id() || $task->assigned_to == Auth::id()){
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'assigned_to' => 'nullable|exists:users,id'
            ]);
            $task->update($data);
            return response()->json($task);
        }
        return response()->json(['message'=>'Unauthorized'],401);
    }

    public function destroy(Task $task)
    {
        if(Auth::user()->is_admin || $task->created_by == Auth::id()){
            $task->delete();
            return response()->json(['message'=>'Task deleted']);
        }
        return response()->json(['message'=>'Unauthorized'],401);
    }

    public function changeStatus(Task $task)
    {
        if(Auth::user()->is_admin || $task->created_by == Auth::id() || $task->assigned_to == Auth::id()){
            $statuses = ['todo','in_progress','done'];
            $currentIndex = array_search($task->status,$statuses);
            $task->status = $statuses[($currentIndex + 1) % count($statuses)];
            $task->save();
            return response()->json($task);
        }
        return response()->json(['message'=>'Unauthorized'],401);
    }

    public function assign(Request $request, Task $task)
    {
        if(Auth::user()->is_admin){
            $request->validate(['assigned_to'=>'required|exists:users,id']);
            $task->assigned_to = $request->assigned_to;
            $task->save();
            return response()->json($task);
        }
        return response()->json(['message'=>'Unauthorized'],401);
    }
}
