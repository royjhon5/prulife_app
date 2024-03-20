<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class MasterFileController extends Controller {

    public function byb_list(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'type_of_byb' => $request->post('type_of_byb') ? $request->post('type_of_byb') : '',
            ];
            try {
                if($data['id'] == 0) {
                    $id = DB::table('tblbyb_type')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tblbyb_type')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tblbyb_type')->where(@$where)->delete();
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            $where = [['id', '<>', '0']];
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['id' => $request['id']];
            }
            $result = DB::table('tblbyb_type')->select('*')->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }


    public function unit_manager_list(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'unit_manager_name' => $request->post('unit_manager_name') ? $request->post('unit_manager_name') : '',
                'unit' => $request->post('unit') ? $request->post('unit') : '',
            ];
            try {
                if($data['id'] == 0) {
                    $id = DB::table('tblumlist')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tblumlist')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tblumlist')->where(@$where)->delete();
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            $where = [['id', '<>', '0']];
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['id' => $request['id']];
            }
            $result = DB::table('tblumlist')->select('*')->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }



    public function requirements_list(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'requirements' => $request->post('requirements') ? $request->post('requirements') : '',
            ];
            try {
                if($data['id'] == 0) {
                    $id = DB::table('tblrequirements_list')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tblrequirements_list')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tblrequirements_list')->where(@$where)->delete();
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            $where = [['id', '<>', '0']];
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['id' => $request['id']];
            }
            $result = DB::table('tblrequirements_list')->select('*')->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }


}
