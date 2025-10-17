import React from 'react';
import Hide from '../../../assets/img/ic_hide.svg';
import Seek from '../../../assets/img/ic_seek.svg';

const EditInfo = () => {
    // 더미데이터
    const old_id = "aster03";
    const old_email = "aster030th@naver.com";
    const notion_email = "aster030th@naver.com";

    return (
        <div className='EditInfo_wrap'>
            <div className="main_header">내 정보 수정</div>
            <div className="main_body">
                <div className="edit_id">
                    <div className="title">아이디</div>
                    <div className="id">
                        <input type="text" placeholder={old_id} className='id_input' />
                        <div className="dupl_btn">중복 확인</div>
                    </div>
                    <div className="warning">이미 삭용 중인 아이디입니다.</div>
                </div>
                <div className="edit_pw">
                    <div className="title">비밀번호</div>
                    <div className="new_pw">
                        <input type="text" placeholder='새로운 비밀번호를 입력해 주세요' className="pw_input" />
                        <img src={Hide} alt="Hide" />
                    </div>
                    <div className="check_new_pw">
                        <input type="text" placeholder='비밀번호를 다시 입력해 주세요' className="pw_input" />
                        <img src={Hide} alt="Hide" />
                    </div>
                    <div className="warning">비밀번호가 일치하지 않습니다.</div>
                </div>
                <div className="edit_email">
                    <div className="title">이메일</div>
                    <input type="text" placeholder={old_email} className="email_input" />
                </div>
                <div className="marketing">
                    <div className="title">마케팅 활용 및 수신 동의</div>
                    <div className="agree">
                        <input type="checkbox" className="agree_email" />
                        <div className="text">이메일</div>
                    </div>
                    <div className="agree">
                        <input type="checkbox" className="agree_email" />
                        <div className="text">SMS</div>
                    </div>
                </div>
                <div className="link_notion">
                    <div className="title">노션 연동하기</div>
                    <input type="text" placeholder={notion_email} className="link_email" />
                </div>
                <div className="divider"></div>
                <div className="finish_btn">내 정보 수정하기</div>
            </div>
        </div>
    )
}

export default EditInfo
