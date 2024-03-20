<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class AdminController extends Controller {
    public function department_list(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'deptName' => $request->post('deptName') ? $request->post('deptName') : '',
                'prefix' => $request->post('prefix') ? $request->post('prefix') : ''
            ];
            try {
                if($data['id'] == 0) {
                    $data['status'] = 1;
                    $id = DB::table('tbldepartmentlist')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tbldepartmentlist')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tbldepartmentlist')->where(@$where)->update(['status' => 0]);
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            $where = [['id', '<>', '0']];
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['id' => $request['id']];
            }
            $result = DB::table('tbldepartmentlist')->select('*')->where('status', '<>', 0)->where($where)->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }

    public function window_list(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'windowName' => $request->post('windowName') ? $request->post('windowName') : '',
                'deptID' => $request->post('deptID') ? $request->post('deptID') : '',
                'userID' => $request->post('userID') ? $request->post('userID') : 0,
                'activity' => $request->post('activity') ? $request->post('activity') : 0,
            ];
            try {
                if($data['id'] == 0) {
                    $data['status'] = 1;
                    $id = DB::table('tblwindowlist')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tblwindowlist')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tblwindowlist')->where(@$where)->update(['status' => 0]);
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            $where = [['wl.id', '<>', '0']];
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['wl.id' => $request['id']];
            }
            if(!empty($request['deptID'])) {
                $request->validate(['deptID' => 'numeric']);
                $where = ['wl.deptID' => $request['deptID'], 'wl.activity' => 0];
            }
            $result = DB::table('tblwindowlist AS wl')
                ->join('tbldepartmentlist AS dl', 'wl.deptID', '=', 'dl.id')
                ->select('wl.*', 'dl.deptName')->where('wl.status', '<>', 0)->where($where)
                ->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }

    public function window_assign(Request $request) {
        if($request->isMethod('post')) {
            $request->validate([
                'windowID' => 'required|numeric',
                'userID' => 'required|numeric'
            ]);
            $data = [
                'windowID' => $request->post('windowID') ? $request->post('windowID') : 0,
                'userID' => $request->post('userID') ? $request->post('userID') : 0,
                'activity' => $request->post('activity') ? $request->post('activity') : 0,
            ];
            try {
                if($data['activity'] == 0) {
                    DB::table('tblwindowlist')->where(['id' => $data['windowID']])->update(['userID' => 0, 'activity' => $data['activity']]);
                    return response()->json(['success' => true, 'message'=> 'Successfully changed.'], 200);
                } else {
                    DB::table('tblwindowlist')->where(['userID' => $data['userID']])->update(['userID' => 0, 'activity' => 0]); // logout other active window of same user
                    DB::table('tblwindowlist')->where(['id' => $data['windowID']])->update(['userID' => $data['userID'], 'activity' => $data['activity']]);
                    return response()->json(['success' => true, 'message'=> 'Successfully assigned.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        } else return response()->json(['message' => 'invalid request.'], 400);
    }

    public function purpose_list(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'purposeName' => $request->post('purposeName') ? $request->post('purposeName') : '',
                'purposeCost' => $request->post('purposeCost') ? $request->post('purposeCost') : 0,
                'deptID' => $request->post('deptID') ? $request->post('deptID') : ''
            ];
            try {
                if($data['id'] == 0) {
                    $data['status'] = 1;
                    $id = DB::table('tblpurposechargelist')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tblpurposechargelist')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tblpurposechargelist')->where(@$where)->update(['status' => 0]);
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            $where = [['pl.id', '<>', '0']];
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['pl.id' => $request['id']];
            }
            $result = DB::table('tblpurposechargelist AS pl')
                ->join('tbldepartmentlist AS dl', 'pl.deptID', '=', 'dl.id')
                ->select('pl.*', 'dl.deptName')->where('pl.status', '<>', 0)->where($where)
                ->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }

    public function purposes_selected(Request $request) {
        if($request->isMethod('get')){
            $request->validate(['trans_id' => 'numeric']);
            return response()->json($this->get_purpose_selected($request['trans_id']), 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }
}


