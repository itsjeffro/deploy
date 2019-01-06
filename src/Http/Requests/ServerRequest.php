<?php

namespace Deploy\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'ip_address' => 'required|ip',
            'port' => 'required|integer',
            'connect_as' => 'required',
            'project_path' => 'required',
        ];
    }
}