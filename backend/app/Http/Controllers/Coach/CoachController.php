<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CoachController extends Controller
{
    /**
     * Check if the user is a coach.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkCoach()
    {
        $user = Auth::user();
        $isCoach = $user && $user->isCoach();

        return response()->json([
            'isCoach' => $isCoach,
        ]);
    }

    /**
     * Get all sessions for the authenticated coach.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSessions()
    {
        $user = Auth::user();
        
        if (!$user || !$user->isCoach()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $sessions = Session::where('coach_id', $user->id)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        return response()->json([
            'sessions' => $sessions,
        ]);
    }

    /**
     * Create a new session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createSession(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !$user->isCoach()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['required', 'date_format:H:i'],
            'duration' => ['required', 'integer', 'min:15', 'max:480'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $session = Session::create([
            'coach_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'date' => $request->date,
            'time' => $request->time,
            'duration' => $request->duration,
            'price' => $request->price,
            'status' => 'available',
        ]);

        return response()->json([
            'message' => 'Session created successfully',
            'session' => $session,
        ], 201);
    }

    /**
     * Delete a session.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSession($id)
    {
        $user = Auth::user();
        
        if (!$user || !$user->isCoach()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $session = Session::where('id', $id)
            ->where('coach_id', $user->id)
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Session not found',
            ], 404);
        }

        // Only allow deletion of available sessions
        if ($session->status !== 'available') {
            return response()->json([
                'message' => 'Cannot delete a booked or completed session',
            ], 400);
        }

        $session->delete();

        return response()->json([
            'message' => 'Session deleted successfully',
        ]);
    }
} 