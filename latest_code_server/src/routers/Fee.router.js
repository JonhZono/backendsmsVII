const express = require('express');
const router = express.Router();

const { userAuthorization, roleBase } = require('../middleware/authorization.middleware');
const { processEmail } = require('../helpers/email.helper');
const {getFees, insertFee, updateFee, deleteFee} = require('../models/fee/Fee.model');

router.get('/', userAuthorization, roleBase('admin'), async (req, res) => {
  try {
    const fees = await getFees();
    return res.json({ status: 'success', fees });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

router.post('/insert', userAuthorization, roleBase('admin'), async (req, res) => {
  try {
    const fee = await insertFee(req.body);
    if (fee._id) {
      //await processEmail({ email, type: 'daily-report' }); //add verification later
      return res.json({
        status: 'success',
        message: 'Fee Created!',
        fee,
      });
    }
    return res.json({
      status: 'error',
      message: 'Unable to create fee',
    });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
});

router.put('/update/:_id', userAuthorization, roleBase('admin'), async (req, res) => {
  try {
    const feeBody = ({ gmail_lists, month, fee_template} = req.body);

    const { _id } = req.params;
    const result = await updateFee(_id, feeBody);
    if (result._id) {
      return res.json({
        status: 'success',
        message: 'The fee has been updated',
      });
    }
    res.json({
      status: 'error',
      message: 'Unable to update fee',
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

//admin
router.delete('/:_id', userAuthorization, roleBase('admin'), async (req, res) => {
  const { _id } = req.params;
  await deleteFee({ _id });

  return res.json({ status: 'success', message: 'Fee deleted' });
});

module.exports = router;
