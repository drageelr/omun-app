# Tourism App - API Specification Document

## Important Notes
- Every **Response Object** will contain `{statusCode: Number, statusName: "String", message: "String"}` in addition to the mentioned object.
- All APIs where **Acess** feild is not **-** must send the `token`  as *"Authorization"* header with every request.

## APIs

### 1. Authentication
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|
|-|----|-----------|-----|------------|--------------|-------------------------|------|
|1|Login|Authentication for Admin/Delegate/Dias|`/api/auth/login/:type` Note: **:type** can be **admin**, **dias** or **delegate**|`{email*: String, password*: String}`|POST|`{token: String, user: {id: Number, name: String}}`|-|

- **Note: * means the field mentioned is required (For `Request Object`)**

### 2. Account Management
|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|Access|
|-|----|-----------|-----|------------|--------------|-------------------------|------|
|1|Create Admins|Create Admins in Bulk|`/api/account/create/admin`|`{admins*: [name*: String.max(50), email*: String.max(50)]}`|POST|`{ids: [Number]}`|`Admin`|
|2|Create Committee|Create Committees in Bulk|`/api/account/create/committee`|`{committees*: [{name*: String.max(100), initials*: String.max(20)}]}`|POST|`{ids: [Number]}`|`Admin`|
|3|Create Countries|Create Countries in Bulk|`/api/account/create/country`|`{{countries*: [{name*: String.max(100), initials*: String.max(20), veto*: Boolean}]}}`|POST|`{ids: [Number]}`|`Admin`|
|4|Create Dias|Create Dias in Bulk|`/api/account/create/dias`|`{dias*: [name*: String.max(50), email*: String.max(50), title*: String.max(10), committeeId*: Number]}`|POST|`{ids: [Number]}`|`Admin`|
|5|Create Delegates|Create Delegates in Bulk|`/api/account/create/delegate`|`{delegates*: [name*: String.max(50), email*: String.max(50), title*: String.max(10), committeeId*: Number, countryId*: Number]}`|POST|`{ids: [Number]}`|`Admin`|
|6|Change Password|Change password for Admin/Dias/Delegate|`/api/account/change-password`|`{oldPassword*: String.min(8).max(30), newPassword: String.min(8).max(30)}`|POST|`{}`|`Admin`, `Dias`, `Delegate`|

- **Note: * means the field mentioned is required (For `Request Object`)**

### 3. Fetch 

## Error Objects
### Introduction
Error object standard:
```javascript=1
{
name: "String",
details: object/"String"/Number
}
```
Hence, standard error output:
```javascript=1
{
statusCode: Number, 
statusName: "String", 
message: "String", 
error: {
    name: "String", 
    details: object/"String"/Number
  }
}
```