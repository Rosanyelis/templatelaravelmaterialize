<a href="{{ route('users.edit', $id) }}" class="btn btn-primary btn-sm">
    <i class="mdi mdi-square-edit-outline"></i>
</a>

<button type="button" class="btn btn-danger btn-sm" onclick="deleteRecord({{ $id }})" >
    <i class="mdi mdi-delete"></i>
</button>
