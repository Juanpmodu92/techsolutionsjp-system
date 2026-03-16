export function handleDatabaseError(error) {
  if (error?.code === '23505') {
    return {
      status: 409,
      message: 'Duplicate value violates unique constraint'
    };
  }

  if (error?.code === '23503') {
    return {
      status: 400,
      message: 'Referenced record does not exist'
    };
  }

  if (error?.code === '22P02') {
    return {
      status: 400,
      message: 'Invalid input format'
    };
  }

  return {
    status: 500,
    message: 'Internal server error'
  };
}