<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function insert_trail($id, $new_trail_status, $window_id = 0, $dept_id = 0, $is_for_extraction = 0) {
        DB::table('tbltransactiontrail')->where(['THDRID' => $id])->update(['trailStatus' => 'DONE']);  // set last trail to done
        if($window_id > 0) DB::table('tbltransactiontrail')->where(['windowID' => $window_id])->where('statusRemarks', '<>', 'TENDER/END')->update(['trailStatus' => 'DONE']);  // set last trail to done
        $trail_data = [
            'THDRID' => $id,
            'deptID' => ($dept_id > 0 ? $dept_id : ($dept_id == 0 ? @Auth::user()->deptID : 0)),
            'windowID' => $window_id,
            'datetime_created' => date('Y-m-d H:i:s'),
            'userID' => (isset(Auth::user()->id) ? Auth::user()->id : 0),
            'statusRemarks' => $new_trail_status,
            'trailStatus' => "ACTIVE",
            'isForExtraction' => $is_for_extraction
        ];
        DB::table('tbltransactiontrail')->insertGetId($trail_data); // update trail table
        $update_data = ['currentStatusRemarks' => $new_trail_status];
        if($new_trail_status == 'TENDERED/END') $update_data = ['currentStatusRemarks' => $new_trail_status, 'status' => 'CLOSED'];
        DB::table('tbltransactionhdr')->where(['id' => $id])->update($update_data); // update header table
        return true;
    }

    public function catch_sql_error($exception){
        if (App::environment('local')) return $exception->getMessage();
        else return 'internal server error occured.';
    }

    public function check_date($date){
        if(checkdate(date('m', strtotime($date)), date('d', strtotime($date)), date('Y', strtotime($date)))) return true;
        else return false;
    }

    public function calculate_age($birth_date) {
        //date in mm/dd/yyyy format; or it can be in other formats as well
        if($this->check_date($birth_date)){
            $birthDate = date('m/d/Y', strtotime($birth_date));
            //explode the date to get month, day and year
            $birthDate = explode("/", $birthDate);
            //get age from date or birthdate
            $age = (date("md", date("U", mktime(0, 0, 0, $birthDate[0], $birthDate[1], $birthDate[2]))) > date("md")
            ? ((date("Y") - $birthDate[2]) - 1)
            : (date("Y") - $birthDate[2]));
            return $age;
        } else return 0;
    }

    public function get_department_details($dept_id){
        $department = DB::table('tbldepartmentlist')->select('deptName')->where(['id' => $dept_id])->limit(1)->get();
        return @$department[0];
    }

    public function get_purpose_selected($trans_hdr_id){
        $result = DB::table('tbltransactiondtl AS dtl')
            ->join('tblpurposechargelist AS pl', 'pl.id', '=', 'dtl.PCLID')
            ->select('pl.*')
            ->where(['dtl.THDRID' => $trans_hdr_id])->get();
        return @$result;
    }
}
