<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    /**
     * Check if the user is a client.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkClient()
    {
        $user = Auth::user();
        $isClient = $user && $user->isClient();

        return response()->json([
            'isClient' => $isClient,
        ]);
    }

    /**
     * Get all available sessions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableSessions()
    {
        $user = Auth::user();
        
        if (!$user || !$user->isClient()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $sessions = Session::where('status', 'available')
            ->where('date', '>=', now()->format('Y-m-d'))
            ->with('coach:id,name')
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        return response()->json([
            'sessions' => $sessions,
        ]);
    }

    /**
     * Get all booked sessions for the authenticated client.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBookedSessions()
    {
        $user = Auth::user();
        
        if (!$user || !$user->isClient()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $bookings = Booking::where('client_id', $user->id)
            ->with(['session' => function ($query) {
                $query->with('coach:id,name');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform the data to match the expected format
        $sessions = $bookings->map(function ($booking) {
            $session = $booking->session;
            $session->booking_id = $booking->id;
            $session->booking_date = $booking->created_at->format('Y-m-d H:i:s');
            return $session;
        });

        return response()->json([
            'sessions' => $sessions,
        ]);
    }

    /**
     * Book a session.
     *
     * @param  int  $sessionId
     * @return \Illuminate\Http\JsonResponse
     */
    public function bookSession($sessionId)
    {
        $user = Auth::user();
        
        if (!$user || !$user->isClient()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $session = Session::where('id', $sessionId)
            ->where('status', 'available')
            ->first();

        if (!$session) {
            return response()->json([
                'message' => 'Session not found or not available',
            ], 404);
        }

        // Check if the session date is in the future
        if (strtotime($session->date) < strtotime('today')) {
            return response()->json([
                'message' => 'Cannot book a session in the past',
            ], 400);
        }

        // Use a transaction to ensure data consistency
        DB::beginTransaction();
        try {
            // Create the booking
            $booking = Booking::create([
                'client_id' => $user->id,
                'session_id' => $session->id,
                'status' => 'booked',
            ]);

            // Update the session status
            $session->update([
                'status' => 'booked',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Session booked successfully',
                'booking' => $booking,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to book session',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel a booking.
     *
     * @param  int  $bookingId
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancelBooking($bookingId)
    {
        $user = Auth::user();
        
        if (!$user || !$user->isClient()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $booking = Booking::where('id', $bookingId)
            ->where('client_id', $user->id)
            ->where('status', 'booked')
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found or cannot be cancelled',
            ], 404);
        }

        // Use a transaction to ensure data consistency
        DB::beginTransaction();
        try {
            // Update the booking status
            $booking->update([
                'status' => 'cancelled',
            ]);

            // Update the session status back to available
            $booking->session->update([
                'status' => 'available',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Booking cancelled successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to cancel booking',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
} 