<p>A tutor has requested a payout.</p>

<ul>
    <li><strong>Tutor:</strong> {{ $tutor->name }} ({{ $tutor->email }})</li>
    <li><strong>Amount:</strong> ₦{{ number_format(($payout?->amount_cents ?? 0) / 100, 0) }}</li>
    <li><strong>Expected date:</strong> {{ $payout?->expected_date }}</li>
    <li><strong>Status:</strong> {{ $payout?->status }}</li>
</ul>

<p>Open the dashboard to review and process this request.</p>

