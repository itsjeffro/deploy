<?php

namespace Deploy\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectGeneralRequest extends FormRequest
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
            'provider_id' => 'required',
            'repository' => 'required',
            'branch' => 'required',
            'releases' => 'required|integer|min:1|max:100',
        ];
    }
}
