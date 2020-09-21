<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body style="margin: 0; padding: 0; box-sizing: border-box;">

    <div style="background: #F3F3F5; height: 100%; box-sizing: border-box; font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif; ">
        <div style="position: relative; padding: 30px;">
            <div style="box-sizing: border-box; max-width: 600px; margin: 0 auto; min-height: 100%;">
                <div style="box-sizing: border-box; padding: 1.5rem 0; background-color:<?=$data['color_background']?>; color:<?= $data['color_text']?>; position: absolute; left: 0; top: 0; height: 100%; width: 100%; z-index: 1;">
                    <div style="text-align: center; height: 50px; width: 50px; border-radius: 50%; margin: 0 auto; padding: 1.25rem; background-color:<?=$data['color_background']?>;color:<?=$data['color_text']?>;">
                        <img src="<?=base_url()?>assets/images/logo.png" alt="<?=$data['app_name']?>" style="height: 100%; width: 100%; object-fit: contain;
                        border-radius: 50%;">
                    </div>
                    <h1 style="text-align: center; color: <?=$data['color_text']?>; font-size: 40px; line-height: 1;">
                        <?=$data['app_name']?>
                    </h1>
                </div>
                <div style="box-sizing: border-box; background: #fff; padding: 2.5rem 1.5rem 70px 1.5rem; z-index: 2; position: relative; text-align: center; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
					<?php if(!empty($data['name'])){ ?>
                    <h1 style="font-size: 30px; font-weight: 400; line-height: 1.6; margin: 0;">Hey <span style="font-size: 36px; font-weight: bolder; line-height: 1.2; margin: 0;">$data['name']</span>,</h1>
					<?php }else{ ?>
					 <h1 style="font-size: 30px; font-weight: 400; line-height: 1.6; margin: 0;">Hey there,</h1>
					<?php } ?>
                    <p style="color: #888; font-weight: 300; line-height: 1.4; font-size: 14px;"><?=$data['message']?></p>
					<?php if(!empty($data['url'])){ ?>
                    <div style="text-align: center; padding-top: 0.4rem;">
                        <a href="<?=$data['url']?>" style="font-weight:bold;background-color:<?=$data['color_background']?>;color:<?php $data['color_text']?>; padding: 1rem 2.35rem; min-width: 180px;max-width: 240px; border-radius: 8px; display: inline-block; box-sizing: border-box; text-decoration: none;"><?=$data['url_title']?></a>
                    </div>
					<?php } ?>
                </div>
            </div>
        </div>
    </div>

</body>

</html>