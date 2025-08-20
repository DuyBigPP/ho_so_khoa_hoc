const BASE_URL = "https://hskh-backend.onrender.com"


// login
export const REGISTER = `${BASE_URL}/api/users/register`; // POST
/*
request body:
{
  "email": "string",
  "password": "string",
  "full_name": ""
}
*/
export const LOGIN = `${BASE_URL}/api/users/login`; // POST
/*
request body:
{
  "email": "string",
  "password": "string"
}
response body:
{
  "access_token": "",
  "token_type": "bearer"
  "role": "user" | "admin"
}
*/
export const LOGOUT = `${BASE_URL}/api/users/logout`; // POST

export const GET_PROFILE_COMPLETION_STATUS = `${BASE_URL}/api/users/me/completion-status`; // GET
/*
response body:
{
  "is_first_time": true,
  "completion_percentage": 0,
  "required_fields": [
    "string"
  ],
  "missing_fields": [
    "string"
  ],
  "next_step": "string",
  "can_submit_works": true
}
*/

export const COMPLETE_USER_PROFILE = `${BASE_URL}/api/users/me/complete-profile`; // PUT
/*
request body:
{
  "full_name": "string",
  "phone_number": "string",
  "birth_date": "2025-08-18",
  "thoi_gian_cong_tac": 0,
  "so_nam_sau_ts": 0,
  "so_gio_giang_chuan": 0,
  "so_hoc_vien_thac_si_huong_dan": 0,
  "so_ncs_tien_si_huong_dan": 0,
  "so_de_tai_cap_bo": 0,
  "so_de_tai_cap_co_so": 0
}
*/

export const GET_USER_PROFILE = `${BASE_URL}/api/users/me`; // GET
/*
response body:
{
  "id": 13,
  "full_name": "user1",
  "email": "user1@example.com",
  "phone_number": "0876875645",
  "birth_date": "2000-01-18",
  "avatar_path": null,
  "thoi_gian_cong_tac": 3,
  "so_nam_sau_ts": 3,
  "so_gio_giang_chuan": 3,
  "so_hoc_vien_thac_si_huong_dan": 2,
  "so_ncs_tien_si_huong_dan": 2,
  "so_de_tai_cap_bo": 2,
  "so_de_tai_cap_co_so": 3,
  "created_at": "2025-08-18T11:57:54"
  "avatar_url": "https://hskh-backend.onrender.com/uploads/avatar_13_577ebe9e-4384-4bfd-82ea-b4b328efdaeb.jpg"
}
*/

export const UPDATE_USER_PROFILE = `${BASE_URL}/api/users/me`; // PUT
/*
request body:
{
 "full_name": "string",
  "phone_number": "string",
  "birth_date": "2025-08-20",
  "thoi_gian_cong_tac": 0,
  "so_nam_sau_ts": 0,
  "so_gio_giang_chuan": 0,
  "so_hoc_vien_thac_si_huong_dan": 0,
  "so_ncs_tien_si_huong_dan": 0,
  "so_de_tai_cap_bo": 0,
  "so_de_tai_cap_co_so": 0
}
*/

export const UPLOAD_AVATAR = `${BASE_URL}/api/users/upload-avatar`; // POST
/*
request body:
file *
string($binary)
*/

export const UPLOAD_DOCUMENT = `${BASE_URL}/api/users/upload-document`; // POST
/*
request body:
work_id
integer
document_type *
string
file *
string($binary)
*/

