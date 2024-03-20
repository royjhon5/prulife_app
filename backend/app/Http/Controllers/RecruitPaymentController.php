<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecruitPaymentController extends Controller {
   
    public function new_payment(Request $request) {
        if($request->isMethod('post')) {
            $data = [
                'id' => $request->post('id') ? $request->post('id') : 0,
                'paid_exams' => $request->post('paid_exams') ? $request->post('paid_exams') : 0,'paid_exams' => $request->post('paid_exams') ? $request->post('paid_exams') : 0,
                'or_number' => $request->post('or_number') ? $request->post('or_number') : 0,
                'traditional' => $request->post('traditional') ? $request->post('traditional') : 0,
                'variable' => $request->post('variable') ? $request->post('variable') : 0,
                'exam_date' => ($request->post('exam_date') and $this->check_date($request->post('exam_date'))) ? $request->post('byb_date') : null,
            ];
            try {
                if($data['id'] == 0) {
                    $id = DB::table('tblrecruit_status')->insertGetId($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been saved.', 'id' => $id], 200);
                } else {
                    $request->validate(['id' => 'required|numeric']);
                    DB::table('tblrecruit_status')->where(['id' => $data['id']])->update($data);
                    return response()->json(['success' => true, 'message'=> 'Data has been updated.'], 200);
                }
            } catch (\Illuminate\Database\QueryException $ex) {
                return response()->json(['success' => false, 'message'=> $this->catch_sql_error($ex)], 500);
            }
        }elseif($request->isMethod('delete')){
            $request->validate(['id' => 'required|numeric']);
            $where = ['id' => $request['id']];
            $result = DB::table('tblrecruit_status')->where(@$where)->delete();
            
            return response()->json(['success' => true, 'message' => 'Successfully deleted.'], 200);
        }elseif($request->isMethod('get')){
            if(!empty($request['id'])) {
                $request->validate(['id' => 'numeric']);
                $where = ['trs.id' => $request['id']];
            }
            $result = DB::table('tblrecruit_status as trs')
                    ->join('tblnew_recruit as tnr', 'tnr.id','=','trs.client_id')
                    ->select('trs.*', 'tnr.first_name', 'tnr.middle_name', 'tnr.last_name')
                    ->where(@$where)
                    ->get();
            return response()->json($result, 200);
        } else return response()->json(['message' => 'invalid request.'], 400);
    }


}
