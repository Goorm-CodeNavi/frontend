import React, { useState } from "react";
import Hide from '../../assets/img/ic_hide.svg';
import Seek from '../../assets/img/ic_seek.svg';
import Agree from '../../assets/img/ic_agree.svg';
import Disagree from '../../assets/img/ic_disagree.svg';
import Checked from '../../assets/img/ic_checked.svg';
import Unchecked from '../../assets/img/ic_unchecked.svg';
import GotoDetail from '../../assets/img/ic_goto_detail.svg';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    return (
        <div className='SignUp_wrap'>
            <div className="signup_container">
                <h1>SIGN UP</h1>
                <div className="user_id">
                    <div className="title">아이디</div>
                    <div className="id_input">
                        <input type="text" placeholder="아이디를 입력해주세요" />
                        <div className="dupl_btn">중복 확인</div>
                    </div>
                    <div className="warning">이미 사용 중인 아이디입니다.</div>
                </div>
                <div className="user_pw">
                    <div className="title">비밀번호</div>
                    <div className="new_pw">
                        <div className="pw_input">
                            <input type="text" placeholder="비밀번호를 입력해주세요" />
                            <img src={Hide} alt="pw_visible" />
                        </div>
                    </div>
                    <div className="check_pw">
                        <div className="pw_input">
                            <input type="text" placeholder="비밀번호를 다시 입력해주세요" />
                            <img src={Hide} alt="pw_visible" />
                        </div>
                    </div>
                    <div className="warning">비밀번호가 일치하지 않습니다</div>
                </div>
                <div className="user_email">
                    <div className="title">이메일</div>
                    <div className="email_input">
                        <input type="text" placeholder="이메일을 입력해주세요" />
                    </div>
                </div>
                <div className="user_agrees">
                    <div className="service_agree">
                        <div className="agreeinfo">
                            <img src={Disagree} alt="service_agree" />
                            <div className="agree_title">
                                <div className="highlight">[필수]</div> CODENAVI 서비스 이용 약관에 동의합니다
                            </div>
                        </div>
                        <div className="goto_detail">
                            <img src={GotoDetail} alt="GotoDetail" />
                        </div>
                    </div>
                    <div className="userinfo_agree">
                        <div className="agreeinfo">
                            <img src={Disagree} alt="" />
                            <div className="agree_title">
                                <div className="highlight">[필수]</div> 개인정보 취급방법 및 이용안내에 동의합니다
                            </div>
                        </div>
                        <div className="goto_detail">
                            <img src={GotoDetail} alt="GotoDetail" />
                        </div>
                    </div>
                    <div className="marketing_agree">
                        <div className="agreeinfo">
                            <img src={Disagree} alt="marketing_agree" />
                            <div className="agree_title">[선택] 마케팅 활용 및 수신에 동의합니다</div>
                        </div>
                        <div className="marketing_type">
                            <div className="m_email">
                                <img src={Unchecked} alt="Unchecked" />
                                <div className="m_text">이메일</div>
                            </div>
                            <div className="m_sms">
                                <img src={Unchecked} alt="Unchecked" />
                                <div className="m_text">SMS</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="signup_btn">가입하기</div>
            </div>
        </div>
    )
}

export default SignUp
