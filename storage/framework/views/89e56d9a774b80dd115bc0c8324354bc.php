<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Transaction Notification</title>
</head>

<body
    style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background-color: #4a90e2; padding: 20px; text-align: center; color: #fff;">
                            <h1 style="margin: 0;">Transaction Alert 🚀</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="font-size: 16px; color: #333;">Hi <strong><?php echo e($data->name); ?></strong>,</p>

                            <p style="font-size: 16px; color: #333;">
                                A transaction has just been <?php echo e($data->type); ?>ed on your account. Below are the
                                details:
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                                <tr>
                                    <td style="padding: 10px; background-color: #f9f9f9;"><strong>Amount:</strong></td>
                                    <td style="padding: 10px;"> <?php echo e(config('app.currency')); ?>

                                        <?php echo e(number_format($data->amount, 2)); ?></td>
                                </tr>

                                <tr>
                                    <td style="padding: 10px; background-color: #f9f9f9;"><strong>Account
                                            Balance:</strong></td>
                                    <td style="padding: 10px;"> <?php echo e(config('app.currency')); ?>

                                        <?php echo e(number_format($data->balance, 2)); ?></td>
                                </tr>

                                <tr>
                                    <td style="padding: 10px; background-color: #f9f9f9;"><strong>Type:</strong></td>
                                    <td style="padding: 10px;"><?php echo e(ucfirst($data->type)); ?></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; background-color: #f9f9f9;"><strong>Status:</strong></td>
                                    <td style="padding: 10px;"><?php echo e(ucfirst($data->status)); ?></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; background-color: #f9f9f9;"><strong>Date:</strong></td>
                                    <td style="padding: 10px;"><?php echo e($data->created_at); ?></td>
                                </tr>
                            </table>

                            <p style="font-size: 16px; color: #333;">If you have any questions or concerns, feel free to
                                contact our support team.</p>

                            <p style="font-size: 16px; color: #333;">Thanks for choosing us!</p>

                            <p style="font-size: 16px; color: #4a90e2; font-weight: bold;">— <?php echo e(config('app.name')); ?>

                                Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                            &copy; <?php echo e(date('Y')); ?> <?php echo e(config('app.name')); ?>. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
<?php /**PATH /Users/mac/Herd/mydelsu/resources/views/mail/transaction-mail.blade.php ENDPATH**/ ?>