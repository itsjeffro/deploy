<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\UpdatePasswordRequest;

class AccountPasswordController extends Controller
{
    /**
     * Update the password of the current user that is logged in.
     *
     * @param  \Deploy\Http\Requests\UpdatePasswordRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdatePasswordRequest $request)
    {
        $user = auth()->user();
        $user->password = bcrypt($request->input('new_password'));
        $user->save();

        return redirect('account')->with([
            'message' => 'Successfully updated password.'
        ]);
    }
}