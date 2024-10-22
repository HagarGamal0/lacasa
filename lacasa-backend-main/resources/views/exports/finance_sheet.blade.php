<table>
    <thead>
        <tr>
            <th>Order ID</th>
            <th>Date</th>
            <!-- <th>Account Manager</th> -->
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Customer Name</th>
            <th>Payment Method</th>
            <th>Vendor</th>
            <th>Shipping Status</th>
            <th>Shipped By</th>
            <th>Subtotal</th>
            <th>Shipping Fees</th>
            <th>Com%</th>
            <th>Commission</th>
            <th>Total Discounts</th>
            <th>Total</th>
            <th>Penalty</th>
            <th>Extra Profit</th>
            <th>Lacasa Credit</th>
            <th>Vendor Credit</th>
            <th>Is Complete?</th>
        </tr>
    </thead>
    <tbody>
        @foreach($equations as $equation)
        <tr>
            <td>{{ $equation['order_id'] }}</td>
            <td>{{ $equation['date'] }}</td>
            <!-- <td>{{ $equation['account_manager'] }}</td> -->
            <td>{{ $equation['product']['id'] }}</td>
            <td>{{ $equation['product']['name'] }}</td>
            <td>{{ $equation['customer']['name'] }}</td>
            <td>{{ $equation['payment_method'] }}</td>
            <td>{{ $equation['vendor'] }}</td>
            <td>{{ $equation['shipping_status'] }}</td>
            <td>{{ $equation['product']['shipped_by'] }}</td>
            <td>{{ $equation['subtotal'] }}</td>
            <td>{{ $equation['shipping_fees'] }}</td>
            <td>{{ $equation['commission_percentage'] }}</td>
            <td>{{ $equation['commission'] }}</td>
            <td>{{ $equation['total_discounts'] }}</td>
            <td>{{ $equation['total'] }}</td>
            <td>0</td>
            <td>0</td>
            <th>{{ $equation['to_be_transferred_to_lacasa'] }}</th>
            <th>{{ $equation['to_be_transferred_to_vendor'] }}</th>
            <th>{{ $equation['is_complete'] }}</th>

        </tr>
        @endforeach
    </tbody>
</table>
