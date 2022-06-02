<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!--<link href="login.css" rel="stylesheet">-->
</head>
<body>
<script type="text/javascript">
function click_test(){
    let dataObj = {
        name: document.getElementById("login:username").value,
        pass: document.getElementById("login:password").value
    };

    fetch("LoginFunction.php", {
        method: 'post',
        body: JSON.stringify(dataObj)
    }).then(data => window.location.replace(data.url))
    .then(response => console.log(response)).catch(error => console.log(error));
}
</script>
    <div id="login_div">
        <form id="login" name="login" method="post" class="form-login" action="LoginFunction.php">
            <h1 id="h1">NJIT Portal</h1>
            <p>Please log in</p>
            <div class="dialog">
                <table>
                    <tbody>
                        <tr class="prop">
                            <td class="name"><label for="login:username">UCID:</label></td>
                            <td class="value"><input id="login:username" type="text" name="login:username" class="form-login" size="30" placeholder="Username" required autofocus></td>
                        </tr>
                        <tr class="prop">
                            <td class="name"><label for="login:password">Password:</label></td>
                            <td class="value"><input id="login:password" type="password" name="login:password" class="form-login" size="30" placeholder="Password"></td>
                        </tr>
                        <td><div class="button" style="margin: 1em 1em">
                            <input class="form-control" type="button" onclick="click_test();" value="Login">
                        </div></td>
                    </tbody>
                </table>
            </div>
        </form>
    </div>
</body>
</html>
