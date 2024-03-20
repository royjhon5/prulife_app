<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {
    // register a new user method
    public function register(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'username' => $request->post('username') ? $request->post('username') : '',
                'fullName' => $request->post('fullName') ? $request->post('fullName') : '',
                'deptID' => $request->post('deptID') ? $request->post('deptID') : '',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            try {
                if($data['id'] == 0) {
                    $request->validate([
                        'username' => 'required|unique:tbllogin,username',
                        'fullName' => 'required|string',
                        'deptID' => 'required|numeric',
                    ]);
                    $data['password'] = Hash::make("Default@123");
                    $id = DB::table('tbllogin')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Successfully inserted.', 'id' => $id], 200);
                } else {
                    $request->validate([
                        'id' => 'required|numeric',
                        'username' => 'required|string',
                        'fullName' => 'required|string',
                        'deptID' => 'required|numeric',
                    ]);
                    DB::table('tbllogin')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Successfully updated.'], 200);
                }
            } catch (Exception $e) {
                return response()->json(['success' => false, 'message'=> $e->getMessage(), 'id' => 0], 500);
            }
        }else return response()->json(['message' => 'invalid request.'], 400);
    }

    public function change_password(Request $request){
        if($request->isMethod('post')) {
            $request->validate(['password' => 'required|string']);
            $data = [
                'id' => isset(Auth::user()->id) ? Auth::user()->deptID : 0,
                'password' => $request->post('password') ? Hash::make($request->post('password')) : '',
            ];
            DB::table('tbllogin')->where(['id' => $data['id']])->update($data);
            return response()->json(['success' => true, 'message'=> 'Password has been changed.'], 200);
        }else return response()->json(['message' => 'invalid request.'], 400);
    }

    // login a user method
    public function login(Request $request) {
        $request['username'] = $request['username'];
        $request->validate([
            'username' => 'required|string|exists:tbllogin,username',
            'password' => 'required|string',
        ]);
        $user = User::where('username', $request['username'])->first();
        $result = DB::table('tbllogin')->select('*')->where(['username' => $request['username']])->get();
        if (!$result || !Hash::check($request['password'], $result[0]->password)) {
            return response()->json([
                'message' => 'Email or password is incorrect!'
            ], 401);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        $cookie = cookie('token', $token, 60 * 12);
        return response()->json(['user' => $result], 200)->withCookie($cookie);
    }

    // logout a user method
    public function logout(Request $request) {
        DB::table('tblwindowlist')->where(['userID' => @Auth::user()->id])->update(['userID' => 0, 'activity' => 0]); // logout other active window of same user
        
        $request->user()->currentAccessToken()->delete();
        $cookie = cookie()->forget('token');
        return response()->json([
            'message' => 'Logged out successfully!'
        ])->withCookie($cookie);
    }

    // get the authenticated user method
    public function user(Request $request) {
        $result = DB::table('tbllogin')->select('*')->where(['username' => $request->user()->username])->get();
        return response()->json($result, 200);
    }

    public function user_list(Request $request) {
        if($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tbllogin')->where(@$where)->update(['status' => 0]);
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            $where = [['l.id', '<>', '0']];
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['l.id' => $request['id']];
            }
            $result = DB::table('tbllogin AS l')
                ->join('tbldepartmentlist AS dl', 'l.deptID', '=', 'dl.id')
                ->leftJoin('tblwindowlist AS wl', function($join){
                    $join->on('l.id', '=', 'wl.userID');
                    $join->on('wl.activity', '=', DB::raw(1));
                })
                ->select('l.*', 'dl.deptName', 'wl.id AS windowID', 'wl.windowName')->where('l.status', '<>', 0)->where($where)
                ->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }
}
