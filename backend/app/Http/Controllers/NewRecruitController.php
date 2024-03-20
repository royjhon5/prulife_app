<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class NewRecruitController extends Controller{
    public function new_recruit(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'first_name' => $request->post('first_name') ? $request->post('first_name') : '',
                'middle_name' => $request->post('middle_name') ? $request->post('middle_name') : '',
                'last_name' => $request->post('last_name') ? $request->post('last_name') : '',
                'contact_number' => $request->post('contact_number') ? $request->post('contact_number') : 0,
                'byb_date' => ($request->post('byb_date') and $this->check_date($request->post('byb_date'))) ? $request->post('byb_date') : null,
                'recruiters_name' => $request->post('recruiters_name') ? $request->post('recruiters_name') : '',
                'byb_type_id' => $request->post('byb_type_id') ? $request->post('byb_type_id') : 0,
                'manager_id' => $request->post('manager_id') ? $request->post('manager_id') : 0,
            ];
            try {
                if($data['id'] == 0) {
                    $id = DB::table('tblnew_recruit')->insertGetId($data);
                    $data['id'] = $id;
                    DB::table('tblrecruit_status')->insert(['client_id' => $id]);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tblnew_recruit')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tblnew_recruit')->where(@$where)->delete();
            
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['tnr.id' => $request['id']];
            }
            $result = DB::table('tblnew_recruit as tnr')
                    ->join('tblbyb_type as tbt', 'tbt.id','=','tnr.byb_type_id')
                    ->join('tblumlist as tu', 'tu.id','=','tnr.manager_id')
                    ->select('tnr.*', 'tbt.type_of_byb', 'tu.unit_manager_name', 'tu.unit')
                    ->where(@$where)
                    ->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }

}
