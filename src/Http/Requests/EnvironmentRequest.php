<?php

namespace Deploy\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnvironmentRequest extends FormRequest
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
            'key' => 'required',
            'contents' => 'required',
            'servers' => 'array',
        ];
    }
}
