// Shows a loading message, or an error message with a "Try again" button.
function StatusMessage({ type, message, onRetry }) {
  if (type === 'loading') {
    return (
      <div className="status status--loading" role="status">
        <span className="status__spinner" aria-hidden="true"></span>
        <p>{message}</p>
      </div>
    )
  }

  return (
    <div className="status status--error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="status__button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default StatusMessage
