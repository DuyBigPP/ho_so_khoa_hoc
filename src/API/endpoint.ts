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

export const GET_ARTICLE = `${BASE_URL}/api/me/articles`; //GET
/*
param:
status
string
(query)
status
limit
integer
(query)
Default value : 50
50
offset
integer
response body:
{
  "articles": [
    {
      "id": 2,
      "title": "Sự đồng nhiễm và đặc trưng kiểu gen của Porcine circovirus type 2 và 3 trên heo có dấu hiệu rối loạn sinh sản và hô hấp",
      "journal_name": "Khoa học Kỹ thuật Thú y",
      "publication_date": "2025-03-03",
      "volume": "29",
      "issue": "12",
      "pages": "1-15",
      "doi": null,
      "is_main_author": 1,
      "co_authors": "Nguyễn Văn B, Trần Thị C, Dr. John Smith",
      "calculated_points": 0,
      "status": "verified_auto",
      "evidence_file": null,
      "created_at": "2025-08-20T04:29:12",
      "updated_at": "2025-08-20T04:32:47",
      "field_of_study": "Chăn nuôi - Thú y - Thuỷ sản",
      "publisher": "Hội Thú y Việt Nam"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
*/

export const POST_ARTICLE = `${BASE_URL}/api/me/articles`; //POST
/*
request body:
{
  "title": "Machine Learning Applications in Healthcare: A Comprehensive Review",
  "journal_name": "Nature Medicine",
  "publisher": "Nature Publishing Group",
  "field_of_study": "Công nghệ thông tin",
  "publication_date": "2023-12-15",
  "volume": "29",
  "issue": "12",
  "pages": "1-15",
  "doi": "10.1038/s41591-023-02345-6",
  "is_main_author": true,
  "co_authors": "Nguyễn Văn B, Trần Thị C, Dr. John Smith",
}
*/

export const GET_ARTICLE_BY_ID = `${BASE_URL}/api/me/articles/{article_id}`; //GET
/*
param:
article_id *
integer
*/

export const UPDATE_ARTICLE = `${BASE_URL}/api/me/articles/{article_id}`; //PUT
/*
param:
article_id *
integer
request body:
{
  "title": "string",
  "journal_name": "string",
  "publication_date": "2025-08-20",
  "field_of_study": "string",
  "publisher": "string",
  "volume": "string",
  "issue": "string",
  "pages": "string",
  "doi": "string",
  "is_main_author": true,
  "co_authors": "string",
}
*/

export const DELETE_ARTICLE = `${BASE_URL}/api/me/articles/{article_id}`; //DELETE
/*
param:
article_id *
integer
*/

export const ARTICLE_STATUS = `${BASE_URL}/api/me/articles/stats`; //GET
/*
response body:
{
  "summary": {
    "total_articles": 1,
    "total_points": 0,
    "main_author_count": 1,
    "total_journals": 1
  },
  "by_status": [
    {
      "status": "verified_auto",
      "count": 1
    }
  ],
  "by_year": [
    {
      "year": 2025,
      "count": 1,
      "total_points": 0
    }
  ],
  "top_journals": [
    {
      "journal_name": "Khoa học Kỹ thuật Thú y",
      "count": 1
    }
  ]
}
*/


export const GET_FIELD_OF_STUDY = `${BASE_URL}/api/fields-of-study`; //GET
/* response body:
{
  "fields_of_study": [
    {
      "id": 1,
      "name": "Chăn nuôi - Thú y - Thuỷ sản"
    },
    {
      "id": 2,
      "name": "Cơ học"
    },
    {
      "id": 3,
      "name": "Cơ khí - Động lực"
    },
    {
      "id": 4,
      "name": "Công nghệ thông tin"
    },
    ...
*/