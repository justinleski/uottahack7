module.exports = async function main(req, res) {
    try {
        if (req.session.user) {
            req.session.destroy();
            res.cookie("sid", "NONE", {
                secure: false,
                maxAge: Number(process.env.SERVER_INACTIVITY_TIMEOUT),
                sameSite: 'Lax',
                httpOnly: true
            });
            res.sendStatus(200);
        }
        else res.sendStatus(403);
    }
    catch (e) {
        res.sendStatus(500);
    }

}